import * as express from "express";
import { UserController } from "../controllers/user.controller";

const UserRouter = express.Router();

UserRouter.post("/signup", UserController.createUser);

UserRouter.post("/login", UserController.userLogin);

export = UserRouter;
