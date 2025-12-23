import express from "express";
import bcbRoutes from "./routes/bcb.routes.js";

export default (app) => {
  const router = express.Router();

  app.use("/api", router);

  router.use("/bcb", bcbRoutes);
};
