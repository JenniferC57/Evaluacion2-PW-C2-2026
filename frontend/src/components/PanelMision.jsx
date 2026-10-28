import { Alert, Badge, Container, Spinner } from "reactstrap";

// Panel superior: créditos, costo total, tiempo restante y estado "Calculando peso...".
function PanelMision({ creditos, total, segundosRestantes, confirmada, cargando }) {
  // Pasamos los segundos a formato minutos:segundos (ej. 4:05).
  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const tiempoTexto = `${minutos}:${String(segundos).padStart(2, "0")}`;

  // Cuando queda 1 minuto o menos, el tiempo se pinta en rojo.
  let colorTiempo = "success";
  if (segundosRestantes <= 60) {
    colorTiempo = "danger";
  }

  return (
    <Alert color="info" fade={false} className="rounded-0 mb-0 py-2 shadow-sm">
      <Container className="d-flex flex-wrap align-items-center justify-content-between column-gap-4 row-gap-1">
        <div>
          <strong className="fs-5 me-3">AstroLogistics</strong>
          {/* "invisible" oculta el texto pero guarda su espacio para que nada se mueva */}
          <span className={cargando ? "" : "invisible"}>
            <Spinner size="sm" /> Calculando peso...
          </span>
        </div>

        <span>
          Créditos disponibles: <strong>{creditos} Cr</strong>
        </span>

        <span>
          Costo total de Carga:{" "}
          <Badge color="dark" pill>
            {total} Cr
          </Badge>
        </span>

        {confirmada ? (
          <Badge color="success">Carga confirmada</Badge>
        ) : (
          <span>
            Ventana de lanzamiento: <Badge color={colorTiempo}>{tiempoTexto}</Badge>
          </span>
        )}
      </Container>
    </Alert>
  );
}

export default PanelMision;
