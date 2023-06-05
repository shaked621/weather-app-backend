import * as express from "express";
import { WeatherController } from "../controllers/weather.controllers";

const WeatherRouter = express.Router();

WeatherRouter.get("/get/weather", WeatherController.getweather);

export = WeatherRouter;
