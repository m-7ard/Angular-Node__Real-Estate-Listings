import createApplication from "api/createApplication";
import responseLogger from "api/middleware/responseLogger";
import getMigrations from "api/utils/getMigrations";
import MySQLDatabaseService from "infrastructure/services/MySQLDatabaseService";
import { assert, literal, union } from "superstruct";

if (global.crypto == null) {
    global.crypto = require('crypto');
}

async function main() {
    // Get environment file
    const environment = process.env.NODE_ENV;
    console.log(environment);
    const environmentValidator = union([literal("DEVELOPMENT"), literal("PRODUCTION"), literal("DOCKER")]);
    assert(environment, environmentValidator);
    require("dotenv").config({
        path: `${process.cwd()}/.env.${environment}`,
    });

    const port = process.env.PORT == null ? null : parseInt(process.env.PORT);
    const portValidator = union([literal(4200), literal(3000)]);
    assert(port, portValidator);

    const host = process.env.HOST;
    const hostValidator = union([literal("127.0.0.1"), literal("0.0.0.0")]);
    assert(host, hostValidator);

    const databaseHost = process.env.DATABASE_HOST;
    const databaseHostValidator = union([literal("127.0.0.1"), literal("mysql")]);
    assert(databaseHost, databaseHostValidator);

    const db = new MySQLDatabaseService({
        host: databaseHost,
        port: 3306,
        user: "root",
        password: "adminword",
    });

    const migrations = await getMigrations();
    await db.initialise(migrations);

    const app = createApplication({
        port: port,
        middleware: [responseLogger],
        database: db,
        mode: environment,
    });

    const server = app.listen(port, host, () => {
        console.log(`Server running at http://${host}:${port}/`);
    });
}

try {
    main();
} catch (err: any) {
    process.exit();
}
