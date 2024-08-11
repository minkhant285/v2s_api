import { DataSource } from "typeorm";
import { envData } from "../utils/environment";
import { User } from "../resources/user/user.entity";

export const AppDataSource = new DataSource({
    type: "sqlite",
    // host: envData.db_host,
    // port: envData.db_port,
    // username: envData.db_username,
    // password: envData.db_pass,
    database: "base.sqlite",
    synchronize: true,
    logging: false,
    entities: [User],
    subscribers: [],
    migrations: [],
});