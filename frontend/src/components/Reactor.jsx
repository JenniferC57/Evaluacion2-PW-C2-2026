import { useState } from "react";
import { Alert, Badge, Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, ListGroup, ListGroupItem, Row, Spinner } from "reactstrap";
import { ajustarTemperatura, reiniciarReactor } from "./services/reactorApi.js";

export default function Reactor() {
  const [temperatura, setTemperatura] = useState("");
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [estabilizado, setEstabilizado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const fallidos = historial.filter((intento) => !intento.estabilizado);

  async function manejarAjuste(evento) {
    evento.preventDefault();
    if (cargando || estabilizado) return;
    const valor = Number(temperatura);
    if (temperatura.trim() === "" || !Number.isInteger(valor) || valor < 1 || valor > 100) {
      setError("Ingresa un numero entero entre 1 y 100.");
      return;
    }
    setCargando(true);
    setError("");
    try {
      const datos = await ajustarTemperatura(valor);
      setMensaje(datos.mensaje);
      setEstabilizado(datos.estabilizado);
      setHistorial((anteriores) => [...anteriores, { temperatura: valor, ...datos }]);
      setTemperatura("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarReinicio() {
    if (cargando) return;
    setCargando(true);
    setError("");
    try {
      const datos = await reiniciarReactor();
      // Solo limpiar la sesión cuando el servidor confirme el reinicio.
      setTemperatura("");
      setHistorial([]);
      setEstabilizado(false);
      setMensaje(datos.mensaje);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <Container tag="main" className="py-4">
      <p className="text-primary fw-semibold mb-1">CONTROL DEL SISTEMA</p>
      <h1>Estabiliza el Reactor</h1>
      <p className="text-muted">Encuentra la temperatura ideal entre 1 y 100. El servidor te indicará si debes subirla o bajarla.</p>
      <Row className="g-4">
        <Col md="6">
          <Card className="h-100 shadow-sm">
            <CardBody>
              <Badge color={estabilizado ? "success" : "warning"} className="mb-3">{estabilizado ? "Reactor estabilizado" : "Pendiente de estabilizar"}</Badge>
              <div aria-live="polite">
                {mensaje && <Alert color={estabilizado ? "success" : "info"} fade={false}>{mensaje}</Alert>}
              </div>
              {error && <Alert color="danger" fade={false}>{error}</Alert>}
              <Form onSubmit={manejarAjuste}>
                <FormGroup>
                  <Label for="temperatura">Temperatura de ajuste</Label>
                  <Input id="temperatura" name="temperatura" type="number" min="1" max="100" step="1" required value={temperatura} onChange={(evento) => setTemperatura(evento.target.value)} disabled={cargando || estabilizado} placeholder="Ingresa un entero de 1 a 100" />
                </FormGroup>
                <div className="d-flex flex-wrap gap-2">
                  <Button type="submit" color="primary" disabled={cargando || estabilizado}>Enviar ajuste</Button>
                  <Button type="button" color="secondary" outline onClick={manejarReinicio} disabled={cargando}>Reiniciar reactor</Button>
                </div>
              </Form>
              {cargando && <p className="mt-3 mb-0" role="status"><Spinner size="sm" /> Procesando solicitud...</p>}
              {estabilizado && <p className="text-success fw-semibold mt-3 mb-0">¡Ganaste! Puedes reiniciar para jugar de nuevo.</p>}
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <Card className="shadow-sm">
            <CardBody>
              <h2 className="h4">Historial de temperaturas</h2>
              <p className="text-muted">Intentos: {historial.length} · Fallidos: {fallidos.length}</p>
              {historial.length === 0 ? <p className="mb-0">Todavía no has enviado ningún ajuste.</p> : (
                <ListGroup aria-label="Registro de intentos">
                  {historial.map((intento, indice) => (
                    <ListGroupItem key={indice} color={intento.estabilizado ? "success" : undefined}>
                      <strong>#{indice + 1} · Temperatura: {intento.temperatura}</strong>
                      <div>{intento.mensaje}</div>
                    </ListGroupItem>
                  ))}
                </ListGroup>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}