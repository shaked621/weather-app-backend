import * as express from "express";

import * as WeatherRouter from "./weather.router";
import * as UserRouter from "./user.router";

const AppRouter = express.Router();

AppRouter.use((req, res, next) => {
  console.log("Called: ", req.path);
  next();
});

AppRouter.use("/api/auth", UserRouter);
AppRouter.use("/api", WeatherRouter);

export = AppRouter;
