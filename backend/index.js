import express from "express";
import bcbRoutes from "./routes/bcb.routes.js";
import ufRoutes from "./routes/uf.routes.js";
import cepRoutes from "./routes/cep.routes.js";
import tipoimovelRoutes from "./routes/tipoimovel.routes.js";


export default (app) => {
  const router = express.Router();

  app.use("/api", router);

  router.use("/bcb", bcbRoutes);

  router.use("/uf", ufRoutes);

  router.use("/cep", cepRoutes);
  
  router.use("/tipoimovel", tipoimovelRoutes);
};
