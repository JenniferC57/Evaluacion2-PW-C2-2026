import express from "express";
import cors from "cors";
import reactorRoutes from "./routes/reactor.routes.js";
import astrologisticsRoutes from "./routes/astrologistics.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/", reactorRoutes);
app.use("/api", astrologisticsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});