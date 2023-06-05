import * as express from "express";
import * as bodyParser from "body-parser";
import { AppDataSourceService } from "./dal/data-source";
import * as AppRouter from "./routes/router";

const app = express();
AppDataSourceService.initialize();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(AppRouter);
console.log(process.env.APP_PORT);
app.listen(process.env.APP_PORT);
