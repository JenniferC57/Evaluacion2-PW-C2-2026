import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Badge, Button } from "reactstrap";

// Catálogo de la base: una tarjeta por cada suministro del inventario.
function Catalogo({ inventario, bloqueado, onAgregar }) {
  return (
    <Row>
      {inventario.map((suministro) => (
        <Col md="4" xs="12" key={suministro.id}>
          <Card className="mb-3">
            <CardBody>
              <CardTitle tag="h5">{suministro.nombre}</CardTitle>
              <CardSubtitle tag="h6" className="mb-3 text-muted">
                {suministro.categoria}
              </CardSubtitle>

              <p className="mb-1">
                Costo: <Badge color="success">{suministro.precio} Cr</Badge>
              </p>
              <p>
                Stock disponible: <strong>{suministro.stock}</strong>
              </p>

              {/* Si no hay stock el botón se desactiva; si hay, llama al Endpoint 3 */}
              {suministro.stock === 0 ? (
                <Button color="secondary" disabled className="w-100">
                  Agotado en Base
                </Button>
              ) : (
                <Button
                  color="primary"
                  className="w-100"
                  disabled={bloqueado}
                  onClick={() => onAgregar(suministro.id)}
                >
                  Añadir a la Nave
                </Button>
              )}
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Catalogo;
