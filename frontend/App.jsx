import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button, Spinner, UncontrolledAlert } from "reactstrap";
import PanelMision from "./components/PanelMision.jsx";
import Catalogo from "./components/Catalogo.jsx";
import Bodega from "./components/Bodega.jsx";
import MisionTerminada from "./components/MisionTerminada.jsx";
import {
  obtenerInventario,
  obtenerCarga,
  obtenerMision,
  agregarSuministro,
  actualizarUnidades,
  eliminarSuministro,
  confirmarCarga,
  reiniciarMision,
} from "./services/api.js";

function App() {
  // ---------- ESTADOS ----------

  // Lista de suministros de la base (array de objetos).
  const [inventario, setInventario] = useState([]);

  // Carga de la nave tal como la devuelve el backend (object).
  const [carga, setCarga] = useState({
    creditos: 0,
    itemsCargados: [],
    total: 0,
    confirmada: false,
  });

  // Segundos que le quedan a la ventana de lanzamiento (number).
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  // Mensaje de error que devuelve el backend (string).
  const [error, setError] = useState("");

  // true mientras esperamos la respuesta del servidor (boolean).
  const [cargando, setCargando] = useState(false);

  // true cuando ya recibimos los datos del backend por primera vez (boolean).
  const [conectado, setConectado] = useState(false);

  // ---------- CARGAR DATOS ----------

  // Pide inventario, carga y estado de la misión al mismo tiempo.
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

  // Se ejecuta una sola vez, cuando la página se abre.
  useEffect(() => {
    cargarDatos();
  }, []);

  // Cuenta regresiva: cada segundo le restamos 1 al tiempo.
  useEffect(() => {
    // Si ya no queda tiempo o la carga está confirmada, dejamos de contar.
    if (segundosRestantes <= 0 || carga.confirmada) {
      return;
    }

    const temporizador = setTimeout(() => {
      setSegundosRestantes(segundosRestantes - 1);
    }, 1000);

    // Limpieza: cancelamos el temporizador anterior antes de crear otro.
    return () => clearTimeout(temporizador);
  }, [segundosRestantes, carga.confirmada]);

  // ---------- ACCIONES DEL CAPITÁN ----------

  // Endpoint 3: añade 1 unidad del suministro a la nave.
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

  // Endpoint 4: sube o baja las unidades de un suministro (botones + y -).
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

  // Endpoint 5: quita el suministro de la nave (botón Desembarcar).
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

  // Confirma el equipamiento y bloquea la carga.
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

  // Inicia una misión nueva: vacía la nave y reinicia el tiempo.
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

  // ---------- VALORES CALCULADOS ----------

  // Se acabó el tiempo y la carga no se confirmó: la sesión se cierra.
  const tiempoAgotado = conectado && segundosRestantes === 0 && !carga.confirmada;

  // Los botones se bloquean mientras esperamos al servidor o si ya se confirmó.
  const bloqueado = cargando || carga.confirmada;

  // ---------- PANTALLAS ----------

  // 1) Todavía no hay datos del backend.
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

  // 2) Se acabó el tiempo de la misión.
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

  // 3) Pantalla principal de la misión.
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

export default App;
