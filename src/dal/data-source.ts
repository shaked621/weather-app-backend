import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import * as dotenv from "dotenv";
import { UserSession } from "../entity/Session";
dotenv.config();

export const AppDataSource: DataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User, UserSession],
  subscribers: [],
  migrations: [],
});

export class AppDataSourceService {
  private dataSource: DataSource;

  static async addUser(user: User): Promise<void> {
    await AppDataSource.manager.save(user).catch((error) => console.log(error));
  }

  static async checkUser(username: string) {
    const user = await AppDataSource.manager.findOneOrFail(User, {
      where: { username: username },
    });
    return user;
  }

  static async addSession(username: string) {
    const session: UserSession = new UserSession();
    session.username = username;
    await AppDataSource.manager
      .save(session)
      .catch((error) => console.error(error));
    const count: number = await AppDataSource.manager.count(UserSession, {
      where: { username: username },
    });
    return count;
  }

  static async initialize() {
    AppDataSource.initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  }
}
