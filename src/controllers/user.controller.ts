import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import * as bcrypt from "bcrypt";
import { AppDataSourceService } from "../dal/data-source";
import * as jwt from "jsonwebtoken";

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    bcrypt.hash(req?.body?.password, 10, async (err, hash) => {
      if (!err) {
        const user = new User();
        user.username = req?.body?.email;
        user.password = hash;
        await AppDataSourceService.addUser(user)
          .then(() => {
            res.status(201).json({ message: "User Created" });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      } else {
        res.status(500).json({ error: err });
      }
    });
  }

  static async userLogin(req: Request, res: Response, next: NextFunction) {
    let fetchedUser: User;
    await AppDataSourceService.checkUser(req?.body?.email)
      .then((user: User) => {
        if (!user) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(async (result) => {
        if (!result) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        const enteries = await AppDataSourceService.addSession(
          fetchedUser.username
        );
        const token = jwt.sign(
          { email: fetchedUser.username, userId: fetchedUser.id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser.id,
          counter: enteries,
        });
      })
      .catch(() => {
        return res.status(401).json({
          message: "Invalid authentication credentials!",
        });
      });
  }
}
