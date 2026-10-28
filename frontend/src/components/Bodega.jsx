import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ListGroup,
  ListGroupItem,
  ButtonGroup,
  Button,
  Badge,
  Alert,
} from "reactstrap";

// Bodega de carga: lo que el capitán ya subió a la nave.
function Bodega({
  inventario,
  carga,
  bloqueado,
  cargando,
  onCambiarUnidades,
  onDesembarcar,
  onConfirmar,
  onNuevaMision,
}) {
  // El backend solo manda { id, cantidad } de cada item cargado,
  // así que buscamos el nombre y el precio en el inventario.
  const items = carga.itemsCargados.map((item) => {
    const suministro = inventario.find((s) => s.id === item.id);
    return {
      id: item.id,
      cantidad: item.cantidad,
      nombre: suministro ? suministro.nombre : "Suministro " + item.id,
      precio: suministro ? suministro.precio : 0,
    };
  });

  // Sumamos todas las unidades que van en la nave.
  const totalUnidades = items.reduce((suma, item) => suma + item.cantidad, 0);

  return (
    <Card className="mb-3">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <strong>Tu Bodega de Carga</strong>
        <Badge color="primary" pill>
          {totalUnidades} {totalUnidades === 1 ? "unidad" : "unidades"}
        </Badge>
      </CardHeader>

      <CardBody>
        {items.length === 0 ? (
          <p className="text-muted mb-0">La bodega está vacía. Añade suministros desde el catálogo.</p>
        ) : (
          <ListGroup>
            {items.map((item) => (
              <ListGroupItem key={item.id}>
                <div className="fw-bold">{item.nombre}</div>
                <small className="text-muted">
                  {item.precio} Cr c/u · Subtotal: {item.precio * item.cantidad} Cr
                </small>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  {/* Botones - y + : llaman al Endpoint 4 con la nueva cantidad */}
                  <ButtonGroup size="sm">
                    <Button
                      color="secondary"
                      outline
                      disabled={bloqueado || item.cantidad === 1}
                      onClick={() => onCambiarUnidades(item.id, item.cantidad - 1)}
                    >
                      -
                    </Button>
                    <Button color="secondary" disabled>
                      {item.cantidad}
                    </Button>
                    <Button
                      color="secondary"
                      outline
                      disabled={bloqueado}
                      onClick={() => onCambiarUnidades(item.id, item.cantidad + 1)}
                    >
                      +
                    </Button>
                  </ButtonGroup>

                  {/* Desembarcar: llama al Endpoint 5 */}
                  <Button
                    color="danger"
                    outline
                    size="sm"
                    disabled={bloqueado}
                    onClick={() => onDesembarcar(item.id)}
                  >
                    Desembarcar
                  </Button>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        )}
      </CardBody>

      <CardFooter>
        <div className="d-flex justify-content-between mb-2">
          <span>Total de la carga:</span>
          <strong>{carga.total} Cr</strong>
        </div>

        {carga.confirmada ? (
          <>
            <Alert color="success" fade={false} className="mb-2">
              Equipamiento confirmado. ¡La nave está lista para el despegue!
            </Alert>
            <Button color="primary" className="w-100" disabled={cargando} onClick={onNuevaMision}>
              Preparar nueva misión
            </Button>
          </>
        ) : (
          <Button
            color="success"
            className="w-100"
            disabled={bloqueado || items.length === 0}
            onClick={onConfirmar}
          >
            Confirmar equipamiento
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default Bodega;
