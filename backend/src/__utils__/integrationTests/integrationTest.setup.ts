const SECONDS = 1000;
jest.setTimeout(70 * SECONDS)

import createApplication from "api/createApplication";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IDatabaseService from "api/interfaces/IDatabaseService";
import responseLogger from "api/middleware/responseLogger";
import getMigrations from "api/utils/getMigrations";
import { Server } from "http";
import MySQLDatabaseService from "infrastructure/services/MySQLDatabaseService";

const jestConsole = console;

export let db: IDatabaseService;
export let server: Server;
let connection: IDatabaseConnection;

export async function setUpIntegrationTest() {
    db = new MySQLDatabaseService({
        host: "127.0.0.1",
        port: 3306,
        user: "root",
        password: "adminword",
    });

    const app = createApplication({
        port: 4200,
        middleware: [responseLogger],
        database: db,
        mode: "DEVELOPMENT"
    });

    server = app.listen();
}

export async function disposeIntegrationTest() {
    global.console = jestConsole;
    server.close((err) => {
        if (err == null) return;
        console.error(err);
    });
    await db.dispose();
    await connection.dispose();
}

export async function resetIntegrationTest() {
    global.console = require("console");
    const migrations = await getMigrations();
    await db.initialise(migrations);
    connection = await db.getConnection();
    diContainer.register(DI_TOKENS.DATABASE_CONNECTION, connection);
}
