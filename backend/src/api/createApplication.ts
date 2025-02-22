import express, { NextFunction, Request, Response } from "express";
import IDatabaseService from "./interfaces/IDatabaseService";
import teamsRouter from "./routers/teamsRouter";
import diContainer, { DI_TOKENS } from "./deps/diContainer";
import TeamRepository from "infrastructure/repositories/TeamRepository";
import createRequestDispatcher from "./deps/createRequestDispatcher";
import errorLogger from "./middleware/errorLogger";
import playersRouter from "./routers/playersRouter";
import PlayerRepository from "infrastructure/repositories/PlayerRepository";
import cors from "cors";
import usersRouter from "./routers/usersRouter";
import UserRepository from "infrastructure/repositories/UserRepository";
import { JsonWebTokenService } from "infrastructure/services/JsonWebTokenService";
import { BcryptPasswordHasher } from "infrastructure/services/BcryptPasswordHasher";
import MatchRepository from "infrastructure/repositories/MatchRepository";
import matchesRouter from "./routers/matchesRouter";
import ApiModelService from "./services/ApiModelService";
import PlayerExistsValidator from "application/services/PlayerExistsValidator";
import TeamExistsValidator from "application/services/TeamExistsValidator";
import MatchExistsValidator from "application/services/MatchExistsValidator";
import UserExistsValidator from "application/services/UserExistsValidator";
import { AddGoalServiceFactory } from "application/services/AddGoalService";
import { TeamMembershipExistsValidatorFactory } from "application/services/TeamMembershipValidator";
import path from "path";
import knex from "knex";

export default function createApplication(config: {
    port: 3000 | 4200;
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
    database: IDatabaseService;
    mode: "PRODUCTION" | "DEVELOPMENT" | "DOCKER";
}) {
    const { database } = config;
    const app = express();
    app.options("*", cors());
    // console.log("----------------------------");
    app.use(cors());

    // Database
    diContainer.register(DI_TOKENS.DATABASE, database);

    // Query Builder
    const queryBuilder = knex({ client: database.__type });
    diContainer.register(DI_TOKENS.QUERY_BUILDER, queryBuilder);

    // Services
    diContainer.register(DI_TOKENS.JWT_TOKEN_SERVICE, new JsonWebTokenService("super_secret_key"));
    diContainer.register(DI_TOKENS.PASSWORD_HASHER, new BcryptPasswordHasher());
    diContainer.registerFactory(DI_TOKENS.API_MODEL_SERVICE, (diContainer) => {
        return new ApiModelService(diContainer.resolve(DI_TOKENS.PLAYER_REPOSITORY), diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY));
    });

    // Repositories
    diContainer.register(DI_TOKENS.TEAM_REPOSITORY, new TeamRepository(database, queryBuilder));
    diContainer.register(DI_TOKENS.PLAYER_REPOSITORY, new PlayerRepository(database, queryBuilder));
    diContainer.register(DI_TOKENS.USER_REPOSITORY, new UserRepository(database));
    diContainer.register(DI_TOKENS.MATCH_REPOSITORY, new MatchRepository(database, queryBuilder));

    // Application Services
    diContainer.registerFactory(DI_TOKENS.PLAYER_EXISTS_VALIDATOR, (container) => new PlayerExistsValidator(container.resolve(DI_TOKENS.PLAYER_REPOSITORY)));
    diContainer.registerFactory(DI_TOKENS.TEAM_EXISTS_VALIDATOR, (container) => new TeamExistsValidator(container.resolve(DI_TOKENS.TEAM_REPOSITORY)));
    diContainer.registerFactory(DI_TOKENS.USER_EXISTS_VALIDATOR, (container) => new UserExistsValidator(container.resolve(DI_TOKENS.USER_REPOSITORY)));
    diContainer.registerFactory(DI_TOKENS.MATCH_EXISTS_VALIDATOR, (container) => new MatchExistsValidator(container.resolve(DI_TOKENS.MATCH_REPOSITORY)));
    diContainer.registerFactory(
        DI_TOKENS.ADD_GOAL_SERIVICE_FACTORY,
        (container) => new AddGoalServiceFactory(container.resolve(DI_TOKENS.PLAYER_EXISTS_VALIDATOR), container.resolve(DI_TOKENS.TEAM_EXISTS_VALIDATOR)),
    );
    diContainer.registerFactory(DI_TOKENS.TEAM_MEMBERSHIP_EXISTS_VALIDATOR_FACTORY, (container) => new TeamMembershipExistsValidatorFactory());

    // Request Dispatcher
    const dispatcher = createRequestDispatcher();
    diContainer.register(DI_TOKENS.REQUEST_DISPATCHER, dispatcher);

    app.use(express.json({ limit: 1028 ** 2 * 100 }));
    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    app.use("/api/teams/", teamsRouter);
    app.use("/api/players/", playersRouter);
    app.use("/api/users/", usersRouter);
    app.use("/api/matches/", matchesRouter);

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
