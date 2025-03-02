import express, { NextFunction, Request, Response } from "express";
import IDatabaseService from "./interfaces/IDatabaseService";
import createRequestDispatcher from "./deps/createRequestDispatcher";
import errorLogger from "./middleware/errorLogger";
import cors from "cors";
import { JsonWebTokenService } from "infrastructure/services/JsonWebTokenService";
import { BcryptPasswordHasher } from "infrastructure/services/BcryptPasswordHasher";
import ApiModelService from "./services/ApiModelService";
import path from "path";
import knex from "knex";
import ClientRepository from "infrastructure/persistence/ClientRepository";
import MySQLClientMapper from "infrastructure/mappers/MySQL/MySQLClientMapper";
import connectionProviderMiddlewareFactory, { createRequestScopeMiddleware } from "./middleware/connectionProviderMiddlewareFactory";
import UnitOfWork from "infrastructure/persistence/UnitOfWork";
import ClientDomainService from "application/services/domainServices/ClientDomainService";
import UserRepository from "infrastructure/persistence/UserRepository";
import MySQLUserMapper from "infrastructure/mappers/MySQL/MySQLUserMapper";
import UserDomainService from "application/services/domainServices/UserDomainService";
import { DI_TOKENS, IDIContainer } from "./services/DIContainer";
import { createUsersRouter } from "./routers/usersRouter";
import { createClientsRouter } from "./routers/clientsRouter";

export default function createApplication(config: {
    port: 3000 | 4200;
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
    database: IDatabaseService;
    mode: "PRODUCTION" | "DEVELOPMENT" | "DOCKER";
    diContainer: IDIContainer;
}) {
    const { database, diContainer } = config;
    const app = express();
    app.options("*", cors());
    // console.log("----------------------------");
    app.use(cors());

    // Database
    diContainer.register(DI_TOKENS.DATABASE, database);
    
    diContainer.registerFactory(DI_TOKENS.UNIT_OF_WORK, (container) => {
        const connection = container.resolve(DI_TOKENS.DATABASE_CONNECTION);
        const userRepo = container.resolve(DI_TOKENS.USER_REPOSITORY);
        const clientRepo = container.resolve(DI_TOKENS.CLIENT_REPOSITORY);

        return new UnitOfWork(connection, userRepo, clientRepo);
    })

    // Query Builder
    const queryBuilder = knex({ client: "mysql2" });
    diContainer.register(DI_TOKENS.KNEX_QUERY_BUILDER, queryBuilder);

    // Services
    diContainer.register(DI_TOKENS.JWT_TOKEN_SERVICE, new JsonWebTokenService("super_secret_key"));
    diContainer.register(DI_TOKENS.PASSWORD_HASHER, new BcryptPasswordHasher());
    diContainer.registerFactory(DI_TOKENS.API_MODEL_SERVICE, (container) => {
        const clientRepository = container.resolve(DI_TOKENS.CLIENT_REPOSITORY);
        return new ApiModelService(clientRepository);
    });

    diContainer.registerFactory(DI_TOKENS.CLIENT_DOMAIN_SERVICE, (container) => {
        const unitOfWork = container.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new ClientDomainService(unitOfWork); 
    })
    diContainer.registerFactory(DI_TOKENS.USER_DOMAIN_SERVICE, (container) => {
        const unitOfWork = container.resolve(DI_TOKENS.UNIT_OF_WORK);
        const passwordHasher = container.resolve(DI_TOKENS.PASSWORD_HASHER);
        return new UserDomainService(unitOfWork, passwordHasher); 
    })

    // Repositories
    diContainer.register(DI_TOKENS.MAPPER_REGISTRY, { clientMapper: new MySQLClientMapper(), userMapper: new MySQLUserMapper() }); 

    diContainer.registerFactory(DI_TOKENS.CLIENT_REPOSITORY, (container) => {
        const connection = container.resolve(DI_TOKENS.DATABASE_CONNECTION);
        const registry = container.resolve(DI_TOKENS.MAPPER_REGISTRY);
        return new ClientRepository(connection, registry);
    });

    diContainer.registerFactory(DI_TOKENS.USER_REPOSITORY, (container) => {
        const connection = diContainer.resolve(DI_TOKENS.DATABASE_CONNECTION);
        const registry = diContainer.resolve(DI_TOKENS.MAPPER_REGISTRY);
        return new UserRepository(connection, registry);
    });


    // Request Dispatcher
    const dispatcher = createRequestDispatcher();
    diContainer.register(DI_TOKENS.REQUEST_DISPATCHER, dispatcher);

    app.use(express.json({ limit: 1028 ** 2 * 100 }));
    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    app.use(createRequestScopeMiddleware(diContainer));
    app.use(connectionProviderMiddlewareFactory(diContainer));

    app.use("/api/users/", createUsersRouter(diContainer));
    app.use("/api/clients/", createClientsRouter(diContainer));

    app.use("/media", express.static("media"));
    app.use("/static", express.static("static"));
    app.use(errorLogger);

    const DIST_DIR = process.cwd();
    const STATIC_DIR = path.join(DIST_DIR, "static");
    
    app.use(express.static(STATIC_DIR));

    app.get("*", (req, res) => {
        res.sendFile(path.join(STATIC_DIR, "index.html"));
    });

    return app;
}
