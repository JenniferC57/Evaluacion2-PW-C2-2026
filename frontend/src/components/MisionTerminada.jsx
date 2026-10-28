import { Card, CardBody, CardTitle, CardText, Button } from "reactstrap";

// Pantalla que aparece cuando se acaba el tiempo sin confirmar la carga.
function MisionTerminada({ onNuevaMision, cargando }) {
  return (
    <Card className="text-center mx-auto shadow-sm" style={{ maxWidth: "520px" }}>
      <CardBody className="p-4">
        <CardTitle tag="h3">Tiempo agotado</CardTitle>
        <CardText>
          La ventana de lanzamiento se cerró antes de confirmar la carga, así que la sesión terminó.
        </CardText>
        <CardText className="text-muted">
          Al iniciar una nueva misión, los suministros cargados vuelven a la base y tus créditos se reinician.
        </CardText>
        <Button color="primary" size="lg" disabled={cargando} onClick={onNuevaMision}>
          Iniciar nueva misión
        </Button>
      </CardBody>
    </Card>
  );
}

export default MisionTerminada;
