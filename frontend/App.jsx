import Reactor from "./src/components/Reactor.jsx";
import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button, Spinner, UncontrolledAlert } from "reactstrap";
import PanelMision from "./src/components/PanelMision.jsx";
import Catalogo from "./src/components/Catalogo.jsx";
import Bodega from "./src/components/Bodega.jsx";
import MisionTerminada from "./src/components/MisionTerminada.jsx";
import {
  obtenerInventario,
  obtenerCarga,
  obtenerMision,
  agregarSuministro,
  actualizarUnidades,
  eliminarSuministro,
  confirmarCarga,
  reiniciarMision,
} from "./src/components/services/api.js";

function AstroLogistics() {
  const [inventario, setInventario] = useState([]);

  const [carga, setCarga] = useState({
    creditos: 0,
    itemsCargados: [],
    total: 0,
    confirmada: false,
  });

  const [segundosRestantes, setSegundosRestantes] = useState(0);

  const [error, setError] = useState("");

  const [cargando, setCargando] = useState(false);

  const [conectado, setConectado] = useState(false);

  async function cargarDatos() {
    try {
      const [datosInventario, datosCarga, datosMision] = await Promise.all([
        obtenerInventario(),
        obtenerCarga(),
        obtenerMision(),
      ]);

      setInventario(datosInventario);
      setCarga(datosCarga);
      setSegundosRestantes(datosMision.segundosRestantes);
      setConectado(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor. Revisa que el backend esté encendido en el puerto 3000.");
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (segundosRestantes <= 0 || carga.confirmada) {
      return;
    }

    const temporizador = setTimeout(() => {
      setSegundosRestantes(segundosRestantes - 1);
    }, 1000);

    return () => clearTimeout(temporizador);
  }, [segundosRestantes, carga.confirmada]);

  async function manejarAgregar(id) {
    setError("");
    setCargando(true);
    try {
      await agregarSuministro(id, 1);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarCambiarUnidades(id, nuevaCantidad) {
    setError("");
    setCargando(true);
    try {
      await actualizarUnidades(id, nuevaCantidad);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarDesembarcar(id) {
    setError("");
    setCargando(true);
    try {
      await eliminarSuministro(id);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarConfirmar() {
    setError("");
    setCargando(true);
    try {
      await confirmarCarga();
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarNuevaMision() {
    setError("");
    setCargando(true);
    try {
      await reiniciarMision();
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  const tiempoAgotado = conectado && segundosRestantes === 0 && !carga.confirmada;

  const bloqueado = cargando || carga.confirmada;

  if (!conectado) {
    return (
      <Container className="py-5 text-center">
        {error ? (
          <Alert color="danger" fade={false}>
            <p>{error}</p>
            <Button color="danger" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </Alert>
        ) : (
          <>
            <Spinner color="primary" />
            <p className="mt-3">Conectando con la base espacial...</p>
          </>
        )}
      </Container>
    );
  }

  if (tiempoAgotado) {
    return (
      <Container className="py-5">
        {error && (
          <UncontrolledAlert color="warning" fade={false}>
            {error}
          </UncontrolledAlert>
        )}
        <MisionTerminada onNuevaMision={manejarNuevaMision} cargando={cargando} />
      </Container>
    );
  }


  return (
    <>
      {/* Zona fija arriba: panel de la misión y alerta de errores */}
      <div className="sticky-top">
        <PanelMision
          creditos={carga.creditos}
          total={carga.total}
          segundosRestantes={segundosRestantes}
          confirmada={carga.confirmada}
          cargando={cargando}
        />
        {error && (
          <UncontrolledAlert color="warning" fade={false} className="rounded-0 mb-0">
            <strong>Restricción de la misión:</strong> {error}
          </UncontrolledAlert>
        )}
      </div>

      <Container className="py-4">
        <Row>
          <Col lg="8">
            <h4 className="mb-3">Catálogo de la Base</h4>
            <Catalogo inventario={inventario} bloqueado={bloqueado} onAgregar={manejarAgregar} />
          </Col>
          <Col lg="4">
            <Bodega
              inventario={inventario}
              carga={carga}
              bloqueado={bloqueado}
              cargando={cargando}
              onCambiarUnidades={manejarCambiarUnidades}
              onDesembarcar={manejarDesembarcar}
              onConfirmar={manejarConfirmar}
              onNuevaMision={manejarNuevaMision}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

function App() {
  const [pantalla, setPantalla] = useState("reactor");
  return (
    <>
      <Container tag="nav" className="py-3 d-flex flex-wrap gap-2" aria-label="Ejercicios">
        <Button color="primary" outline={pantalla !== "reactor"} aria-pressed={pantalla === "reactor"} onClick={() => setPantalla("reactor")}>Estabiliza el Reactor</Button>
        <Button color="primary" outline={pantalla !== "mision"} aria-pressed={pantalla === "mision"} onClick={() => setPantalla("mision")}>AstroLogistics</Button>
      </Container>
      <div hidden={pantalla !== "reactor"}><Reactor /></div>
      <div hidden={pantalla !== "mision"}>{pantalla === "mision" && <AstroLogistics />}</div>
    </>
  );
}

export default App;