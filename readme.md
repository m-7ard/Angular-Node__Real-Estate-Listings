# Angular & Node Soccer Team Manager Documentation

## Table of Contents
- [Local Setup](#local-setup)
  - [Setup](#setup)
- [Features](#features)
- [Backend Documentation](#backend-documentation)
  - [Core Interfaces and Classes](#core-interfaces-and-classes)
    - [IAction Interface](#iaction-interface)
    - [IActionResponse Interface](#iactionresponse-interface)
    - [JsonResponse Class](#jsonresponse-class)
    - [Example: CreatePlayerAction](#example-createplayeraction)
    - [registerAction Utility](#registeraction-utility)
    - [Dependency Injection System](#dependency-injection-system)
    - [Multi-Environment Application Startup Service](#multi-environment-application-startup-service)
    - [Request Dispatcher (CQRS)](#request-dispatcher-cqrs)
    - [Application Layer Validator / Services](#application-layer-validator--services)
    - [IDatabaseService](#idatabaseservice)
    - [Database Models and Schema Interfaces](#database-models-and-schema-interfaces)
    - [Domain Models & Value Objects](#domain-models--value-objects)
    - [Domain Events & Repositories](#domain-events--repositories)
    - [Api Models & Api Model Service](#api-models--api-model-service)
  - [Integration Test Setup Documentation](#integration-testing-setup-documentation)
    - [Key Functions](#key-functions)
    - [Usage Example](#usage-example)
- [Frontend Documentation](#frontend-documentation)
  - [Data Access](#data-access-documentation)
  - [Authentication Interceptor](#authentication-interceptor-documentation)
  - [Components & Features](#frontend-components--other-features)
    - [Mixin Elements](#mixin-elements)
    - [Layout Directives](#layout-directives)
    - [Dynamic Results Elements](#dynamic-results-elements)
    - [Auth Guards](#auth-guards)
    - [Global Error handling & Routable Exceptions](#global-error-handling--routable-exceptions)
    - [Child Routes & Layouts](#child-routes---layouts)

## Run Locally

### Setup

1. Clone the project
```bash
git clone https://github.com/m-7ard/Angular-Node-Soccer-Manager.git
```

2.a Launch (Docker)
```bash
   docker compose up
```

2.b Launch (Manually)
```bash
    # Navigate to backend directory
    cd backend
    npm install
    npm run test  # Optional
    npm run dev   # Start server

    # navigate to the frontend directory
    cd ..
    cd frontned
    ng serve
```

## Features

- Manage Teams, Players, and Team Memberships & Team Membership Histories
- User authentication using JWTs
- Frontend interceptors for managing request authorization headers
- Separation between Domain Models, Api Models, Db Models & Db Schemas
- Separation of concerns for data fetching in the frontend
- Global error handling
- Backend Integration Tests
- Backend endpoint guards (e.g auth guards)
- Layered architecture & Domain-Driven Design (DDD) methodology
- Manual database migrations

## Backend Documentation

#### Core Interfaces and Classes

##### IAction Interface

This project uses **Actions** as an abstraction to encapsulate request handling logic in a clean and reusable way. Each Action is responsible for:

1. Validating the primitive request data
2. Dispatching business logic via a request dispatcher
3. Generating an appropriate response

The overall structure promotes separation of concerns, testability, and scalability.

```typescript
interface IAction<ActionReq, ActionRes = IActionResponse> {
    handle(request: ActionReq): Promise<ActionRes>;
    bind(request: Request, response: Response): ActionReq;
}
```

##### IActionResponse Interface

Defines a response returned by an action:

```typescript
export interface IActionResponse {
    handle(res: Response): void;
}
```

##### JsonResponse Class

A concrete implementation of `IActionResponse` that formats responses as JSON:

```typescript
class JsonResponse<T extends object | unknown[]> implements IActionResponse {
    constructor({ status, body }: { status: number; body: T }) {
        this.status = status;
        this.body = body;
    }

    handle(res: Response): void {
        res.status(this.status).json(this.body);
    }

    public status: number;
    public body: T;
}
```

##### Example: CreatePlayerAction

Demonstrates handling player creation, including validation, command dispatch, and response generation:

```typescript
class CreatePlayerAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const validation = createPlayerValidator(dto);
        if (validation.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.typeBoxErrorToApiErrors(validation.error),
            });
        }

        const guid = crypto.randomUUID();

        const command = new CreatePlayerCommand({
            id: guid,
            name: dto.name,
            activeSince: dto.activeSince,
        });
        const result = await this._requestDispatcher.dispatch(command);

        if (result.isErr()) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapApplicationErrors(result.error),
            });
        }

        return new JsonResponse({
            status: StatusCodes.CREATED,
            body: {
                id: guid,
            },
        });
    }

    bind(request: Request): ActionRequest {
        return {
            dto: {
                name: request.body.name,
                activeSince: new Date(request.body.activeSince),
            },
        };
    }
}
```

##### registerAction Utility

Simplifies the wiring of actions and routes:

```typescript
function registerAction({
    router,
    initialiseAction,
    path,
    method,
    guards = []
}: {
    router: Router;
    initialiseAction: (req: Request, res: Response) => IAction<unknown, IActionResponse>;
    path: string;
    method: "POST" | "GET" | "PUT" | "DELETE";
    guards?: Array<(req: Request, res: Response, next: NextFunction) => void | Promise<void>>;
}) {
    // Implementation details
}
```

##### Dependency Injection System

Registers and manages dependencies in a Map, it leverages Typescript's branded types to use DI tokens to automatically get the interface of each service we're registering or resolving:

```ts
type TokenType<T> = T extends { __service: infer S } ? S : never;

type TokenMap = typeof DI_TOKENS;
type TokenKeys = keyof TokenMap;
type TokenValues = TokenMap[TokenKeys];

type Factory<T = unknown> = (container: DIContainer) => T;

type Registration<T = unknown> = { type: "instance"; value: T } | { type: "factory"; value: Factory<T> };

const makeToken = <Service>(literal: string) => literal as string & { __service: Service };

export const DI_TOKENS = {
    DATABASE: makeToken<IDatabaseService>("DATABASE"),
    QUERY_BUILDER: makeToken<Knex>("QUERY_BUILDER"),
    REQUEST_DISPATCHER: makeToken<IRequestDispatcher>("REQUEST_DISPATCHER"),
    PASSWORD_HASHER: makeToken<IPasswordHasher>("PASSWORD_HASHER"),
    JWT_TOKEN_SERVICE: makeToken<IJwtTokenService>("JWT_TOKEN_SERVICE"),
    TEAM_REPOSITORY: makeToken<ITeamRepository>("TEAM_REPOSITORY"),
    PLAYER_REPOSITORY: makeToken<IPlayerRepository>("PLAYER_REPOSITORY"),
    USER_REPOSITORY: makeToken<IUserRepository>("USER_REPOSITORY"),
    MATCH_REPOSITORY: makeToken<IMatchRepository>("MATCH_REPOSITORY"),
    API_MODEL_SERVICE: makeToken<IApiModelService>("API_MODEL_SERVICE"),

    ADD_GOAL_SERIVICE_FACTORY: makeToken<IAddGoalServiceFactory>("ADD_GOAL_SERIVICE_FACTORY"),
    
    PLAYER_EXISTS_VALIDATOR: makeToken<IPlayerValidator<PlayerId>>("PLAYER_EXISTS_VALIDATOR"),
    TEAM_EXISTS_VALIDATOR: makeToken<ITeamValidator<TeamId>>("TEAM_EXISTS_VALIDATOR"),
    USER_EXISTS_VALIDATOR: makeToken<UserExistsValidator>("USER_EXISTS_VALIDATOR"),
    MATCH_EXISTS_VALIDATOR: makeToken<MatchExistsValidator>("MATCH_EXISTS_VALIDATOR"),
    TEAM_MEMBERSHIP_EXISTS_VALIDATOR_FACTORY: makeToken<ITeamMembershipExistsValidatorFactory<TeamMembershipId>>("TEAM_MEMBERSHIP_EXISTS_VALIDATOR_FACTORY"),
} as const;

export class DIContainer {
    private dependencies = new Map<string, Registration<unknown>>();

    register<K extends TokenValues>(token: K, instance: TokenType<K>): void {
        this.dependencies.set(token as string, {
            type: "instance",
            value: instance,
        });
    }

    registerFactory<K extends TokenValues>(token: K, factory: Factory<TokenType<K>>): void {
        this.dependencies.set(token as string, {
            type: "factory",
            value: factory,
        });
    }

    resolve<K extends TokenValues>(token: K): TokenType<K> {
        const registration = this.dependencies.get(token as string);

        if (!registration) {
            throw new Error(`Dependency not registered: ${token}`);
        }

        switch (registration.type) {
            case "instance":
                return registration.value as TokenType<K>;
            case "factory":
                return registration.value(this) as TokenType<K>;
            default:
                throw new Error(`Missing registration for: ${token}`);
        }
    }
}

const diContainer = new DIContainer();
```

##### Multi-Environment Application startup service

Instead of using a single file to manage our server, we use a function that takes a config to start our server, effectively letting us create different environments for testing, production and development purposes without having to change the implementation of any of our existing infrastructure:

```ts
export default function createApplication(config: {
    port: 3000 | 4200;
    middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
    database: IDatabaseService;
    mode: "PRODUCTION" | "DEVELOPMENT" | "DOCKER";
}) {
    const { database } = config;
    const app = express();
    app.options("*", cors());
    app.use(cors());

    // Database
    diContainer.register(DI_TOKENS.DATABASE, database);

    /*
    ... Further diContainer regsitrations
    */

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
```

##### Request Dispatcher (CQRS)

In order to communicate with our application layer, a CQRS solution is implemented that uses a request dispatcher inspired by the .Net MediatR libary --- It uses an IRequest interface that is then used in ICommand and IQuery interfaces to declare the application contracts that will then be dispached through a RequestDispatcher class:

```ts
interface IRequest<TResult> {
    __returnType: TResult;
}

export type IQueryResult<Success, Failure> = Result<Success, Failure>;
type IQuery<Result extends IQueryResult<any, any>> = IRequest<Result>;

export type ICommandResult<Failure> = Result<void, Failure>;
type ICommand<Result extends ICommandResult<any>> = IRequest<Result>;

interface IRequestHandler<TCommand extends IRequest<TResult>, TResult> {
    handle(command: TCommand): Promise<TResult>;
}

export default class RequestDispatcher implements IRequestDispatcher {
    private handlers: Map<string, IRequestHandler<any, any>> = new Map();

    registerHandler<TCommand extends IRequest<TResult>, TResult>(
        commandType: new (...args: any[]) => TCommand,
        handler: IRequestHandler<TCommand, TResult>,
    ) {
        this.handlers.set(commandType.name, handler);
    }

    dispatch<TCommand extends IRequest<TResult>, TResult>(command: TCommand): Promise<TCommand["__returnType"]> {
        const handler = this.handlers.get(command.constructor.name);

        if (!handler) {
            const error = new Error(`No handler registered for ${command.constructor.name}`);
            console.error(error);
            throw error;
        }

        return handler.handle(command);
    }
}
```

Example of a command handler

```ts
export type ScheduleMatchCommandResult = ICommandResult<IApplicationError[]>;

export class ScheduleMatchCommand implements ICommand<ScheduleMatchCommandResult>, CommandProps {
    __returnType: ScheduleMatchCommandResult = null!;

    constructor(props: CommandProps) {
        this.id = props.id;
        this.homeTeamId = props.homeTeamId;
        this.awayTeamId = props.awayTeamId;
        this.venue = props.venue;
        this.scheduledDate = props.scheduledDate;
    }

    id: string;
    homeTeamId: string;
    awayTeamId: string;
    venue: string;
    scheduledDate: Date;
}

export default class ScheduleMatchCommandHandler implements IRequestHandler<ScheduleMatchCommand, ScheduleMatchCommandResult> {
    private readonly _matchRepository: IMatchRepository;
    private readonly teamExistsValidator: ITeamValidator<TeamId>;

    constructor(props: { matchRepository: IMatchRepository; teamExistsValidator: ITeamValidator<TeamId> }) {
        this._matchRepository = props.matchRepository;
        this.teamExistsValidator = props.teamExistsValidator;
    }

    async handle(command: ScheduleMatchCommand): Promise<ScheduleMatchCommandResult> {
        if (command.awayTeamId === command.homeTeamId) {
            return err(ApplicationErrorFactory.createSingleListError({
                message: "Away team cannot be the same team as home team.",
                path: [],
                code: APPLICATION_ERROR_CODES.IntegrityError
            }))
        }

        const homeTeamExistsResult = await this.teamExistsValidator.validate(TeamId.executeCreate(command.homeTeamId));
        if (homeTeamExistsResult.isErr()) {
            return err(homeTeamExistsResult.error);
        }

        const awayTeamExistsResult = await this.teamExistsValidator.validate(TeamId.executeCreate(command.awayTeamId));
        if (awayTeamExistsResult.isErr()) {
            return err(awayTeamExistsResult.error);
        }

        const homeTeam = homeTeamExistsResult.value;
        const awayTeam = awayTeamExistsResult.value;

        const isValidMatchDatesValidator = new IsValidMatchDatesValidator();
        const isValidMatchDatesResult = isValidMatchDatesValidator.validate({
            scheduledDate: command.scheduledDate,
            startDate: null,
            endDate: null,
        });
        if (isValidMatchDatesResult.isErr()) {
            return err(isValidMatchDatesResult.error);
        }

        const match = MatchFactory.CreateNew({
            id: command.id,
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            venue: command.venue,
            matchDates: MatchDates.executeCreate({
                scheduledDate: command.scheduledDate,
                startDate: null,
                endDate: null,
            }),
            status: MatchStatus.SCHEDULED,
        });

        await this._matchRepository.createAsync(match);
        return ok(undefined);
    }
}
```

Example of creating the command dispatcher

```ts
function createRequestDispatcher() {
    const requestDispatcher = new RequestDispatcher();
    const teamRepository = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
    /*
        ... Further resolves
    */
    const addGoalServiceFactory = diContainer.resolve(DI_TOKENS.ADD_GOAL_SERIVICE_FACTORY);

    // Players
    requestDispatcher.registerHandler(CreatePlayerCommand, new CreatePlayerCommandHandler({ playerRepository: playerRepository }));
    
    /*
        ... Further registering
    */
    
    // Matches
    requestDispatcher.registerHandler(
        CreateMatchCommand,
        new CreateMatchCommandHandler({ matchRepository: matchRepository, teamExistsValidator: teamExistsValidator, addGoalServiceFactory: addGoalServiceFactory }),
    );
    
    return requestDispatcher;
}
```

##### Application Layer Validator / Services

The application layer makes use of reusable Validators, Validator Factories and Services that will may takes Value Objects to enforce input and are able to be injected into our request handlers.

```ts
// PlayerExistsValidator.ts
class PlayerExistsValidator implements IPlayerValidator<PlayerId> {
    constructor(private readonly playerRepository: IPlayerRepository) {}

    async validate(id: PlayerId): Promise<Result<Player, IApplicationError[]>> {
        const player = await this.playerRepository.getByIdAsync(id);

        if (player == null) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: `Player of id "${id}" does not exist.`,
                    code: APPLICATION_SERVICE_CODES.PLAYER_EXISTS_ERROR,
                    path: [],
                }),
            );
        }

        return ok(player);
    }
}

// TeamMembershipValidator.ts
class TeamMembershipExistsValidator implements ITeamMembershipExistsValidator<TeamMembershipId> {
    constructor(private readonly team: Team) {}

    validate(id: TeamMembershipId): Result<TeamMembership, IApplicationError[]> {
        const result = this.team.tryFindMemberById(id);
        if (result.isErr()) {
            return err(ApplicationErrorFactory.createSingleListError({ message: result.error, path: [], code: APPLICATION_SERVICE_CODES.TEAM_MEMBERSHIP_EXISTS_ERROR }));
        }

        return ok(result.value);
    }
}

export class TeamMembershipExistsValidatorFactory implements ITeamMembershipExistsValidatorFactory<TeamMembershipId> {
    create(team: Team): ITeamMembershipExistsValidator<TeamMembershipId> {
        return new TeamMembershipExistsValidator(team);
    };
}

// AddGoalService.ts
class AddGoalService implements IAddGoalService {
    constructor(
        private readonly match: Match,
        private readonly playerExistsValidator: IPlayerValidator<PlayerId>,
        private readonly teamExistsValidator: ITeamValidator<TeamId>,
    ) {}

    async tryAddGoal(goal: IGoalData): Promise<Result<true, IApplicationError[]>> {
        // Is Match Team
        const isMatchTeam = this.match.isMatchTeam(goal.teamId);
        if (!isMatchTeam) {
            return err(ApplicationErrorFactory.createSingleListError({ message: `Team of id "${TeamId}" is not a Match Team.`, path: [], code: APPLICATION_ERROR_CODES.StateMismatch }));
        }

        // Goal Team Exists
        const goalTeamExistsResult = await this.teamExistsValidator.validate(goal.teamId);
        if (goalTeamExistsResult.isErr()) {
            return err(goalTeamExistsResult.error);
        }

        const goalTeam = goalTeamExistsResult.value;

        // Goal player Exists
        const playerExistsResult = await this.playerExistsValidator.validate(goal.playerId);
        if (playerExistsResult.isErr()) {
            return err(playerExistsResult.error);
        }

        const goalPlayer = playerExistsResult.value;

        // Can Add Goal
        const canAddMatchGoalResult = this.match.canAddGoal({ dateOccured: goal.dateOccured, team: goalTeam, player: goalPlayer });
        if (canAddMatchGoalResult.isErr()) {
            return err(ApplicationErrorFactory.createSingleListError({ message: canAddMatchGoalResult.error, path: [], code: APPLICATION_SERVICE_CODES.CAN_ADD_GOAL_ERROR }));
        }

        if (canAddMatchGoalResult.isErr()) {
            return err(
                ApplicationErrorFactory.createSingleListError({
                    message: canAddMatchGoalResult.error,
                    path: [],
                    code: APPLICATION_SERVICE_CODES.CAN_ADD_GOAL_ERROR,
                }),
            );
        }

        this.match.executeAddGoal({ dateOccured: goal.dateOccured, team: goalTeam, player: goalPlayer });
        return ok(true);
    }
}

export class AddGoalServiceFactory implements IAddGoalServiceFactory {
    constructor(
        private readonly playerExistsValidator: IPlayerValidator<PlayerId>,
        private readonly teamExistsValidator: ITeamValidator<TeamId>,
    ) {}

    create(match: Match): IAddGoalService {
        return new AddGoalService(match, this.playerExistsValidator, this.teamExistsValidator);
    }
    
}
```

##### IDatabaseService

An interface that all database services must implement, this is currently implemented only by MySQLDatabaseService. These classes are in charge of initialising, querying and disposing of the database.

The MySQLDatabaseService will always drop any existing database and then create a new one through the SQL migration files located in /backend/sql. These migration files are prefixed by a XXX pattern where X is a number, it will use this number to order the migrations.

Each implementation has a __type attribute used for services that require the database type, e.g the Knex querybuilder.

```ts
interface IDatabaseService {
    __type: string;
    initialise(migrations: string[]): Promise<void>;
    dispose(): Promise<void>;
    queryRows<T>(args: { statement: string }): Promise<T[]>;
    queryHeaders(args: { statement: string }): Promise<TResultHeader>;
    executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]>;
    executeHeaders<T>(args: { statement: string; parameters: Array<unknown> }): Promise<TResultHeader>;
}

class MySQLDatabaseService implements IDatabaseService {
    private _pool: mysql.Pool;
    private readonly _config: mysql.PoolOptions;
    public readonly __type = "mysql2";

    constructor(config: mysql.PoolOptions) {
        this._pool = mysql.createPool(config);
        this._config = config;
    }

    async initialise(migrations: string[]): Promise<void> {
        await this._pool.query(`DROP DATABASE IF EXISTS football_manager`);
        await this._pool.query(`CREATE DATABASE football_manager`);

        this._pool.end();
        this._pool = mysql.createPool({ ...this._config, database: "football_manager" });

        for (const migration of migrations) {
            await this._pool.query(migration);
        }
    }

    async dispose(): Promise<void> {
        await this._pool.query(`DROP DATABASE IF EXISTS football_manager`);
    }

    async queryRows<T>(args: { statement: string }): Promise<T[]> {
        const { statement } = args;
        const [query] = await this._pool.query<T[] & mysql.RowDataPacket[]>(statement);
        return query;
    }

    async queryHeaders(args: { statement: string }): Promise<TResultHeader> {
        const { statement } = args;
        const [query] = await this._pool.query<TResultHeader & mysql.RowDataPacket[]>(statement);
        return { affectedRows: query.affectedRows };
    }

    async executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]> {
        const { statement, parameters } = args;
        const [query] = await this._pool.execute<T[] & mysql.RowDataPacket[]>(statement, parameters);
        return query;
    }

    async executeHeaders(args: { statement: string; parameters: Array<unknown> }): Promise<TResultHeader> {
        const { statement, parameters } = args;
        const [query] = await this._pool.execute<mysql.ResultSetHeader & mysql.RowDataPacket[]>(statement, parameters);
        return { affectedRows: query.affectedRows };
    }
}
```

##### Database Models and Schema Interfaces

Each database table has a Schema Interface representing its database column types and a Database Model, representing its in memory representation, transforming database column types to desired TS types. Database Models are additionally responsible for loading their FK related values through load____ methods where ____ is the model that is being loaded.

```ts
export default interface ITeamSchema {
    id: string;
    name: string;
    date_founded: Date;
}


class TeamDbEntity implements ITeamSchema {
    constructor(props: { id: string; name: string; date_founded: Date }) {
        this.id = props.id;
        this.name = props.name;
        this.date_founded = props.date_founded;
    }

    public async loadTeamMemberships(db: IDatabaseService): Promise<void> {
        const teamMemberships = await db.queryRows<ITeamMembershipSchema>({ statement: `SELECT * FROM ${TeamMembershipDbEntity.TABLE_NAME} WHERE team_id = '${this.id}'` });
        this.team_memberships = teamMemberships.map((row) => TeamMembershipMapper.schemaToDbEntity(row));
    }

    public id: string;
    public name: string;
    public date_founded: Date;

    public team_memberships: TeamMembershipDbEntity[] = [];

    public static readonly TABLE_NAME = "team";

    public getInsertEntry() {
        return sql`
            INSERT INTO ${raw(TeamDbEntity.TABLE_NAME)} 
            (id, name, date_founded)
            VALUES 
            (${this.id}, ${this.name}, ${this.date_founded})
        `;
    }

    public getUpdateEntry() {
        return sql`
            UPDATE ${raw(TeamDbEntity.TABLE_NAME)} 
            SET 
                name = ${this.name},
                date_founded = ${this.date_founded}
            WHERE
                id = ${this.id}
        `;
    }

    public getDeleteEntry() {
        return sql`
            DELETE FROM ${raw(TeamDbEntity.TABLE_NAME)} 
            WHERE id = ${this.id}
        `;
    }

    public static getByIdStatement(id: TeamDbEntity["id"]) {
        return sql`
            SELECT * 
            FROM ${raw(TeamDbEntity.TABLE_NAME)} 
            WHERE ${raw(TeamDbEntity.TABLE_NAME)}.id = ${id}
        `;
    }
}
```

##### Domain Models & Value Objects

This application conforms to Domain Driven Design (DDD), implementing Domain Aggregates that manage its subdomains through a common interface; The Aggregates and Domains feature methods that will check whether an action can be undertaken, in the format can____, which will return a result object that either returns a value or string error and methods that will execute the action, in the format execute____, that will call its corresponding can____ method and will throw an Error with a message obtained from the can____ method in the case of failure. It will also occasionally feature try____ methods that will perform an action or return a string in the case of failure. 

```ts
class Team {
    private readonly __type: "TEAM_DOMAIN" = null!;
    domainEvents: DomainEvent[] = [];
    clearEvents = () => {
        this.domainEvents = [];
    };

    constructor({ id, name, dateFounded, teamMemberships }: { id: TeamId; name: string; dateFounded: Date; teamMemberships: TeamMembership[] }) {
        this.id = id;
        this.name = name;
        this._dateFounded = dateFounded;
        this.teamMemberships = teamMemberships;
    }

    public id: TeamId;
    public name: string;
    private _dateFounded: Date;
    public teamMemberships: TeamMembership[];

    public get dateFounded() {
        return this._dateFounded;
    }

    private set dateFounded(value: Date) {
        this._dateFounded = value;
    }

    public canUpdateDateFounded(value: Date): Result<true, string> {
        const conflictingTeamMembership = this.teamMemberships.find((teamMembership) => teamMembership.teamMembershipDates.activeFrom < value);

        if (conflictingTeamMembership != null) {
            return err(`Team's date founded (${value}) cannot be greater than one of its Memberships' active from dates (${conflictingTeamMembership.teamMembershipDates.activeFrom}).`);
        }

        return ok(true);
    }

    public executeUpdateDateFounded(value: Date) {
        const canUpdateDateFounded = this.canUpdateDateFounded(value);
        if (canUpdateDateFounded.isErr()) {
            throw new Error(canUpdateDateFounded.error);
        }

        this.dateFounded = value;
    }

    private findMemberByPlayerId(playerId: PlayerId) {
        return this.teamMemberships.find((membership) => membership.playerId.equals(playerId));
    }

    public filterMembersByPlayerId(playerId: PlayerId) {
        return this.teamMemberships.filter((membership) => membership.playerId.equals(playerId));
    }

    public findMemberByPlayerIdOrNull(playerId: PlayerId) {
        return this.teamMemberships.find((membership) => membership.playerId.equals(playerId));
    }

    public findMemberById(teamMembershipId: TeamMembershipId) {
        return this.teamMemberships.find((membership) => membership.id.equals(teamMembershipId));
    }

    public tryFindMemberById(teamMembershipId: TeamMembershipId): Result<TeamMembership, string> {
        const teamMembership = this.findMemberById(teamMembershipId);
        if (teamMembership == null) {
            return err(`Team Membership of id "${teamMembershipId.value}" does not exist on Team of id "${this.id}"`);
        }

        return ok(teamMembership);
    }

    public executeFindMemberById(teamMembershipId: TeamMembershipId): TeamMembership {
        const canFindTeamMemberbyIdResult = this.tryFindMemberById(teamMembershipId);
        if (canFindTeamMemberbyIdResult.isErr()) {
            throw new Error(canFindTeamMemberbyIdResult.error);
        }

        return canFindTeamMemberbyIdResult.value;
    }

    public findActiveMemberByPlayerId(playerId: PlayerId) {
        const membership = this.findMemberByPlayerId(playerId);
        if (membership == null) {
            return null;
        }

        if (membership.isActive()) {
            return membership;
        }

        return null;
    }

    private tryVerifyMemberIntegrity(
        teamMembership: TeamMembership | null,
        player: Player,
        props: {
            activeFrom: Date;
            activeTo: Date | null;
        },
    ): Result<true, string> {
        // Create dates
        const canCreateTeamMembershipDatesResult = TeamMembershipDates.canCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo });
        if (canCreateTeamMembershipDatesResult.isErr()) {
            return err(canCreateTeamMembershipDatesResult.error);
        }

        const teamMembershipDates = TeamMembershipDates.executeCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo });

        // Is overlapping / conflicting date
        const playerTeamMemberships = this.filterMembersByPlayerId(player.id);
        const conflictsWithMembership = playerTeamMemberships.find((playerMembership) => {
            if (playerMembership === teamMembership) return false;
            return playerMembership.isConflictingDate(teamMembershipDates);
        });

        if (conflictsWithMembership != null) {
            return err(
                `Team Member's active dates (${props.activeFrom} to ${props.activeTo}) overlap with an existing team membership active from ${conflictsWithMembership.teamMembershipDates.activeFrom} to ${conflictsWithMembership.teamMembershipDates.activeTo}. Please choose a date range that does not conflict with existing memberships.`,
            );
        }

        // Is membership activeFrom before team was founded
        if (props.activeFrom < this._dateFounded) {
            return err(`Team Member's activeFrom (${props.activeFrom}) cannot be before the team's dateFounded (${this._dateFounded}).`);
        }

        // Is membership activeFrom before player was active
        if (player.activeSince > props.activeFrom) {
            return err(`Team Member's activeFrom ${props.activeFrom} cannot be before the player's activeFrom (${player.activeSince}).`);
        }

        // Are there upcoming teamMembershipHistories
        if (props.activeTo != null && teamMembership != null) {
            const upcomingMemberHistories = teamMembership.filterHistories({ dateEffectiveFromAfter: props.activeTo });
            if (upcomingMemberHistories.length) {
                const requiredDate = Math.max(...upcomingMemberHistories.map(({ dateEffectiveFrom }) => dateEffectiveFrom.getTime()));
                const requiredDateString = new Date(requiredDate).toJSON();

                return err(
                    `Team Member's activeTo date must be null while it has Team Membership Histories with a dateEffectiveFrom greater than the activeTo, make sure to delete them or set activeTo to a date equal or greater than ${requiredDateString}.`,
                );
            }
        }

        return ok(true);
    }

    public canAddMember(props: { id: string; player: Player; activeFrom: Date; activeTo: Date | null }): Result<boolean, string> {
        // Create id
        const canCreateIdResult = TeamMembershipId.canCreate(props.id);
        if (canCreateIdResult.isErr()) {
            return err(canCreateIdResult.error);
        }

        const id = TeamMembershipId.executeCreate(props.id);

        // Does membership already exist
        const membershipById = this.findMemberById(id);
        if (membershipById != null) {
            return err(`Membership with id "${id}" already exists on the team.`);
        }

        const canVerifyIntegrityResult = this.tryVerifyMemberIntegrity(null, props.player, { activeFrom: props.activeFrom, activeTo: props.activeTo });
        if (canVerifyIntegrityResult.isErr()) {
            return err(canVerifyIntegrityResult.error);
        }

        return ok(true);
    }

    public executeAddMember(props: { id: string; player: Player; activeFrom: Date; activeTo: Date | null }): TeamMembershipId {
        const canAddMemberResult = this.canAddMember(props);
        if (canAddMemberResult.isErr()) {
            throw new Error(canAddMemberResult.error);
        }

        const teamMembership = TeamMembershipFactory.CreateNew({
            id: TeamMembershipId.executeCreate(props.id),
            teamId: this.id,
            playerId: props.player.id,
            teamMembershipDates: TeamMembershipDates.executeCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo }),
        });

        this.teamMemberships.push(teamMembership);
        this.domainEvents.push(new TeamMembershipPendingCreationEvent(teamMembership));
        return teamMembership.id;
    }

    public canUpdateMember(teamMembershipId: TeamMembershipId, player: Player, props: { activeFrom: Date; activeTo: Date | null }): Result<true, string> {
        // Does membership exist
        const tryFindTeamMemberResult = this.tryFindMemberById(teamMembershipId);
        if (tryFindTeamMemberResult.isErr()) {
            return err(tryFindTeamMemberResult.error);
        }

        const teamMembership = tryFindTeamMemberResult.value;

        // Does membership player match operation player
        if (!teamMembership.playerId.equals(player.id)) {
            return err(`TeamMemberships's playerId (${teamMembership.playerId}) does not match Player's id (${player.id}).`);
        }

        const canVerifyIntegrityResult = this.tryVerifyMemberIntegrity(teamMembership, player, { activeFrom: props.activeFrom, activeTo: props.activeTo });
        if (canVerifyIntegrityResult.isErr()) {
            return err(canVerifyIntegrityResult.error);
        }

        return ok(true);
    }

    public executeUpdateMember(teamMembershipId: TeamMembershipId, player: Player, props: { activeFrom: Date; activeTo: Date | null }): void {
        const canUpdateTeamMembershipResult = this.canUpdateMember(teamMembershipId, player, props);
        if (canUpdateTeamMembershipResult.isErr()) {
            throw new Error(canUpdateTeamMembershipResult.error);
        }

        const teamMembership = this.executeFindMemberById(teamMembershipId);
        teamMembership.teamMembershipDates = TeamMembershipDates.executeCreate({ activeFrom: props.activeFrom, activeTo: props.activeTo });
        this.domainEvents.push(new TeamMembershipPendingUpdatingEvent(teamMembership));
    }

    public canDeleteTeamMembership(teamMembershipId: TeamMembershipId): Result<true, string> {
        const tryFindTeamMemberResult = this.tryFindMemberById(teamMembershipId);
        if (tryFindTeamMemberResult.isErr()) {
            return err(tryFindTeamMemberResult.error);
        }

        const teamMembership = tryFindTeamMemberResult.value;
        if (teamMembership.teamMembershipHistories.length) {
            return err("Cannot delete TeamMembership while it has TeamMembershipHistories asscociated with it. Make sure to delete them first.");
        }

        return ok(true);
    }

    public executeDeleteTeamMembership(teamMembershipId: TeamMembershipId) {
        const canDeleteTeamMembershipResult = this.canDeleteTeamMembership(teamMembershipId);
        if (canDeleteTeamMembershipResult.isErr()) {
            throw new Error(canDeleteTeamMembershipResult.error);
        }

        const deletedTeamMembership = this.executeFindMemberById(teamMembershipId);
        this.teamMemberships = this.teamMemberships.filter((teamMembership) => teamMembership !== deletedTeamMembership);
        this.domainEvents.push(new TeamMembershipPendingDeletionEvent(deletedTeamMembership));
    }

    public canAddHistoryToTeamMembership(teamMembershipId: TeamMembershipId, props: { id: string; number: number; position: string; dateEffectiveFrom: Date }): Result<true, string> {
        const findTeamMembershipResult = this.tryFindMemberById(teamMembershipId);
        if (findTeamMembershipResult.isErr()) {
            return err(findTeamMembershipResult.error);
        }

        const teamMembership = findTeamMembershipResult.value;
        const canAddHistoryResult = teamMembership.canAddHistory(props);
        if (canAddHistoryResult.isErr()) {
            return err(canAddHistoryResult.error);
        }

        return ok(true);
    }

    public executeAddHistoryToTeamMembership(teamMembershipId: TeamMembershipId, props: { id: string; number: number; position: string; dateEffectiveFrom: Date }): TeamMembershipHistoryId {
        const canAddHistoryToTeamMembershipResult = this.canAddHistoryToTeamMembership(teamMembershipId, props);
        if (canAddHistoryToTeamMembershipResult.isErr()) {
            throw new Error(canAddHistoryToTeamMembershipResult.error);
        }

        const teamMembership = this.executeFindMemberById(teamMembershipId);
        const teamMembershipHistoryId = teamMembership.executeAddHistory(props);
        this.domainEvents.push(...teamMembership.pullDomainEvent());
        return teamMembershipHistoryId;
    }

    public canRemoveHistoryFromTeamMembership(teamMembershipId: TeamMembershipId, teamMembershipHistoryId: TeamMembershipHistoryId): Result<true, string> {
        const findTeamMembershipResult = this.tryFindMemberById(teamMembershipId);
        if (findTeamMembershipResult.isErr()) {
            return err(findTeamMembershipResult.error);
        }

        const teamMembership = findTeamMembershipResult.value;
        const canRemoveHistoryResult = teamMembership.canRemoveHistory(teamMembershipHistoryId);
        if (canRemoveHistoryResult.isErr()) {
            return err(canRemoveHistoryResult.error);
        }

        return ok(true);
    }

    public executeRemoveHistoryFromTeamMembership(teamMembershipId: TeamMembershipId, teamMembershipHistoryId: TeamMembershipHistoryId): void {
        const teamMembership = this.executeFindMemberById(teamMembershipId);
        teamMembership.executeRemoveHistory(teamMembershipHistoryId);
        this.domainEvents.push(...teamMembership.pullDomainEvent());
    }

    public canUpdateTeamMembershipHistory(
        teamMembershipId: TeamMembershipId,
        teamMembershipHistoryId: TeamMembershipHistoryId,
        props: { number: number; position: string; dateEffectiveFrom: Date },
    ): Result<TeamMembership, string> {
        const findTeamMembershipResult = this.tryFindMemberById(teamMembershipId);
        if (findTeamMembershipResult.isErr()) {
            return err(findTeamMembershipResult.error);
        }

        const teamMembership = findTeamMembershipResult.value;
        const canUpdateHistoryResult = teamMembership.canUpdateHistory(teamMembershipHistoryId, props);
        if (canUpdateHistoryResult.isErr()) {
            return err(canUpdateHistoryResult.error);
        }

        return ok(teamMembership);
    }

    public executeUpdateTeamMembershipHistory(
        teamMembershipId: TeamMembershipId,
        teamMembershipHistoryId: TeamMembershipHistoryId,
        props: { number: number; position: string; dateEffectiveFrom: Date },
    ): void {
        const canUpdateTeamMembershipHistoryResult = this.canUpdateTeamMembershipHistory(teamMembershipId, teamMembershipHistoryId, props);
        if (canUpdateTeamMembershipHistoryResult.isErr()) {
            new Error(canUpdateTeamMembershipHistoryResult.error);
        }

        const teamMembership = this.executeFindMemberById(teamMembershipId);
        teamMembership.executeUpdateHistory(teamMembershipHistoryId, props);
        this.domainEvents.push(...teamMembership.pullDomainEvent());
    }
}

interface Props {
    id: TeamMembershipId;
    teamId: TeamId;
    playerId: PlayerId;
    teamMembershipHistories: TeamMembershipHistory[];
    teamMembershipDates: TeamMembershipDates;
}

class TeamMembership implements Props {
    private readonly __type: "TEAM_MEMBERSHIP_DOMAIN" = null!;

    constructor({ id, teamId, playerId, teamMembershipHistories, teamMembershipDates }: Props) {
        this.id = id;
        this.teamId = teamId;
        this.playerId = playerId;
        this.teamMembershipHistories = teamMembershipHistories.sort((a, b) => b.dateEffectiveFrom.getTime() - a.dateEffectiveFrom.getTime());
        this.teamMembershipDates = teamMembershipDates;
    }

    /*
    
        ... Further domain methods

    */
}

class TeamMembershipDates {
    private readonly __type: "TEAM_MEMBERSHIP_DATES" = null!;

    public activeFrom: Date;
    public activeTo: Date | null;

    private constructor(value: { activeFrom: Date; activeTo: Date | null }) {
        this.activeFrom = value.activeFrom;
        this.activeTo = value.activeTo;
    }

    public static canCreate(value: { activeFrom: Date; activeTo: Date | null }): Result<true, string> {
        const { activeFrom, activeTo } = value;

        if (activeTo != null && activeTo < activeFrom) {
            return err("Team Membership's active to date cannot be smaller than its active from date.");
        }

        return ok(true);
    }

    public static executeCreate(value: { activeFrom: Date; activeTo: Date | null }): TeamMembershipDates {
        const canCreateResult = this.canCreate(value);
        if (canCreateResult.isErr()) {
            throw new Error(canCreateResult.error);
        }

        const matchDates = new TeamMembershipDates(value);
        return matchDates;
    }

    public isWithinRange(date: Date) {
        return date >= this.activeFrom && (this.activeTo == null || date <= this.activeTo);
    }
}
```

##### Domain Events & Repositories

To persist aggregates, the application uses Repositories, and in order for each aggreagte to persist its subdomain and/or changes, it uses domain events. Aggregates will pull domain events through the usage of aggregate methods. 

```ts
class TeamRepository implements ITeamRepository {
    private readonly _db: IDatabaseService;
    private readonly queryBuiler: Knex;

    constructor(db: IDatabaseService, queryBuiler: Knex) {
        this._db = db;
        this.queryBuiler = queryBuiler;
    }

    private async persistDomainEvents(team: Team) {
        for (let i = 0; i < team.domainEvents.length; i++) {
            const event = team.domainEvents[i];

            if (event instanceof TeamMembershipPendingCreationEvent) {
                const teamMembership = event.payload;
                const dbEntity = TeamMembershipMapper.domainToDbEntity(teamMembership);
                const sqlEntry = dbEntity.getInsertEntry();

                await this._db.executeHeaders({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipPendingDeletionEvent) {
                const dbEntity = TeamMembershipMapper.domainToDbEntity(event.payload);
                const sqlEntry = dbEntity.getDeleteEntry();

                await this._db.executeHeaders({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipPendingUpdatingEvent) {
                const dbEntity = TeamMembershipMapper.domainToDbEntity(event.payload);
                const sqlEntry = dbEntity.getUpdateEntry();

                await this._db.executeRows({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipHistoryPendingCreationEvent) {
                const dbEntity = TeamMembershipHistoryMapper.domainToDbEntity(event.payload);
                const sqlEntry = dbEntity.getInsertEntry();

                await this._db.executeHeaders({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipHistoryPendingUpdatingEvent) {
                const dbEntity = TeamMembershipHistoryMapper.domainToDbEntity(event.payload);
                const sqlEntry = dbEntity.getUpdateEntry();

                await this._db.executeRows({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            } else if (event instanceof TeamMembershipHistoryPendingDeletionEvent) {
                const dbEntity = TeamMembershipHistoryMapper.domainToDbEntity(event.payload);
                const sqlEntry = dbEntity.getDeleteEntry();

                await this._db.executeHeaders({
                    statement: sqlEntry.sql,
                    parameters: sqlEntry.values,
                });
            }
        }

        team.clearEvents();
    }

    async getByIdAsync(id: TeamId): Promise<Team | null> {
        const sqlEntry = TeamDbEntity.getByIdStatement(id.value);
        const [row] = await this._db.executeRows<ITeamSchema | null>({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (row == null) {
            return null;
        }

        const team = TeamMapper.schemaToDbEntity(row);
        await team.loadTeamMemberships(this._db);

        for (let i = 0; i < team.team_memberships.length; i++) {
            const teamMembership = team.team_memberships[i];
            await teamMembership.loadTeamMembershipHistories(this._db);
        }

        return team == null ? null : TeamMapper.dbEntityToDomain(team);
    }

    async createAsync(team: Team): Promise<void> {
        const dbEntity = TeamMapper.domainToDbEntity(team);
        const sqlEntry = dbEntity.getInsertEntry();

        await this._db.executeHeaders({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        await this.persistDomainEvents(team);
    }

    async updateAsync(team: Team): Promise<void> {
        const dbEntity = TeamMapper.domainToDbEntity(team);
        const sqlEntry = dbEntity.getUpdateEntry();

        await this._db.executeHeaders({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        await this.persistDomainEvents(team);
    }

    async filterAllAsync(criteria: FilterAllTeamsCriteria): Promise<Team[]> {
        let query = this.queryBuiler<ITeamSchema>("team");

        if (criteria.name != null) {
            query.whereILike("team.name", `%${criteria.name}%`);
        }

        if (criteria.teamMembershipPlayerId != null) {
            query = query
                .join("team_membership", "team.id", "team_membership.team_id")
                .where("team_membership.player_id", criteria.teamMembershipPlayerId.value)
                .select("team.*")
                .distinct();
        }

        if (criteria.limitBy) {
            query = query.limit(criteria.limitBy);
        }

        const rows = await this._db.queryRows<ITeamSchema>({
            statement: query.toString(),
        });
        const teams = rows.map(TeamMapper.schemaToDbEntity);

        for (const team of teams) {
            await team.loadTeamMemberships(this._db);

            for (let i = 0; i < team.team_memberships.length; i++) {
                const teamMembership = team.team_memberships[i];
                await teamMembership.loadTeamMembershipHistories(this._db);
            }
        }

        return teams.map(TeamMapper.dbEntityToDomain);
    }

    async deleteAsync(team: Team): Promise<void> {
        for (let i = 0; i < team.teamMemberships.length; i++) {
            const teamMembership = team.teamMemberships[i];
            const dbEntity = TeamMembershipMapper.domainToDbEntity(teamMembership);
            const sqlEntry = dbEntity.getDeleteEntry();

            const headers = await this._db.executeHeaders({
                statement: sqlEntry.sql,
                parameters: sqlEntry.values,
            });

            if (headers.affectedRows === 0) {
                throw Error(`No team_membership of id "${teamMembership.id}" was deleted."`);
            }
        }

        const dbEntity = TeamMapper.domainToDbEntity(team);
        const sqlEntry = dbEntity.getDeleteEntry();

        const headers = await this._db.executeHeaders({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (headers.affectedRows === 0) {
            throw Error(`No team of id "${team.id} was deleted."`);
        }
    }
}
```

##### Api Models & Api Model Service

Instead of returning a raw Domain Model and leaking business data, the Api returns Api models; these Api models are constructed with the help of a IApiModelService implementation that utilises caching to avoid unecessary db calls.

```ts
class ApiModelService implements IApiModelService {
    private readonly playerCache = new Map<Player["id"], Player | null>();
    private readonly teamCache = new Map<Team["id"], Team | null>();

    constructor(
        private readonly playerRepository: IPlayerRepository,
        private readonly teamRepository: ITeamRepository,
    ) {}

    private async getPlayerFromCacheOrDb(playerId: PlayerId): Promise<Player | null> {
        if (this.playerCache.has(playerId)) {
            return this.playerCache.get(playerId)!;
        }

        const player = await this.playerRepository.getByIdAsync(playerId);
        this.playerCache.set(playerId, player);
        return player;
    }

    private async getTeamFromCacheOrDb(teamId: TeamId): Promise<Team | null> {
        if (this.teamCache.has(teamId)) {
            return this.teamCache.get(teamId)!;
        }

        const team = await this.teamRepository.getByIdAsync(teamId);
        this.teamCache.set(teamId, team);
        return team;
    }

    async createMatchApiModel(match: Match): Promise<IMatchApiModel> {
        const homeTeam = await this.getTeamFromCacheOrDb(match.homeTeamId);
        if (homeTeam == null) throw new Error("Home Team does not exist.");

        const awayTeam = await this.getTeamFromCacheOrDb(match.awayTeamId);
        if (awayTeam == null) throw new Error("Away Team does not exist.");

        return ApiModelMapper.createMatchApiModel({
            match: match,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
        });
    }

    async createManyMatchApiModels(matches: Match[]): Promise<IMatchApiModel[]> {
        const results: IMatchApiModel[] = [];

        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            results.push(await this.createMatchApiModel(match));
        }

        return results;
    }

    async createMatchEventApiModel(matchEvent: MatchEvent): Promise<IMatchEventApiModel> {
        const player = await this.getPlayerFromCacheOrDb(matchEvent.playerId);
        if (player == null) throw new Error("Player does not exist.");

        let secondaryPlayer: Player | null = null;
        if (matchEvent.secondaryPlayerId != null) {
            secondaryPlayer = await this.getPlayerFromCacheOrDb(matchEvent.secondaryPlayerId);
            if (secondaryPlayer == null) throw new Error("Secondary player does not exist.");
        }

        return ApiModelMapper.createMatchEventApiModel({
            matchEvent: matchEvent,
            player: player,
            secondaryPlayer: secondaryPlayer,
        });
    }

    async createManyMatchEventApiModel(matchEvents: MatchEvent[]): Promise<IMatchEventApiModel[]> {
        const results: IMatchEventApiModel[] = [];

        for (let i = 0; i < matchEvents.length; i++) {
            const matchEvent = matchEvents[i];
            results.push(await this.createMatchEventApiModel(matchEvent));
        }

        return results;
    }

    async createTeamPlayerApiModel(teamMembership: TeamMembership): Promise<ITeamPlayerApiModel> {
        const player = await this.getPlayerFromCacheOrDb(teamMembership.playerId);
        if (player == null) throw new Error("Player does not exist.");

        return {
            membership: ApiModelMapper.createTeamMembershipApiModel(teamMembership),
            player: ApiModelMapper.createPlayerApiModel(player),
        };
    }

    async createManyTeamPlayerApiModel(teamMemberships: Array<TeamMembership>): Promise<ITeamPlayerApiModel[]> {
        const results: ITeamPlayerApiModel[] = [];

        for (let i = 0; i < teamMemberships.length; i++) {
            const teamMembership = teamMemberships[i];
            results.push(await this.createTeamPlayerApiModel(teamMembership));
        }

        return results;
    }

    async createMatchParticipantsApiModel(match: Match): Promise<IMatchParticipantsApiModel> {
        const homeTeam = await this.getTeamFromCacheOrDb(match.homeTeamId);
        if (homeTeam == null) throw new Error("Home Team doesn't exist.");

        const awayTeam = await this.getTeamFromCacheOrDb(match.homeTeamId);
        if (awayTeam == null) throw new Error("Away Team doesn't exist.");

        return {
            awayTeamPlayers: awayTeam.teamMemberships.map((teamMembership) => ApiModelMapper.createMatchTeamPlayerApiModel(match, teamMembership)),
            homeTeamPlayers: homeTeam.teamMemberships.map((teamMembership) => ApiModelMapper.createMatchTeamPlayerApiModel(match, teamMembership)),
        };
    }
}
```

### Integration Test Setup Documentation

#### Key Functions

- `setUpIntegrationTest()`: Initializes database and test server
- `disposeIntegrationTest()`: Cleans up resources
- `resetIntegrationTest()`: Resets database state

#### Usage Example

```typescript
describe("Player API Integration Tests", () => {
    beforeAll(async () => {
        await setUpIntegrationTest();
    });

    afterAll(async () => {
        await disposeIntegrationTest();
    });

    beforeEach(async () => {
        await resetIntegrationTest();
    });

    // Test cases
});
```

## Frotnend Documentation

### Data Access Documentation

The application uses injectable data access in order to access the API, this data access utilises the shared DTO models between Api and the frontend (These need to be copied manually, however there is no extra configuration necesarry thanks to the use of folder aliases).

```ts
@Injectable({
    providedIn: 'root',
})
export class TeamDataAccessService {
    private readonly _baseUrl = `${environment.apiUrl}/api/teams`;
    constructor(private http: HttpClient) {}

    createTeam(request: ICreateTeamRequestDTO) {
        return this.http.post<ICreateTeamRequestDTO>(`${this._baseUrl}/create`, request);
    }

    createTeamMembership(id: string, request: ICreateTeamMembershipRequestDTO) {
        return this.http.post<ICreateTeamMembershipResponseDTO>(`${this._baseUrl}/${id}/create-membership`, request);
    }

    deleteTeamMembership(teamId: string, teamMembershipId: string, request: IDeleteTeamMembershipRequestDTO) {
        return this.http.delete<IDeleteTeamMembershipResponseDTO>(
            `${this._baseUrl}/${teamId}/memberships/${teamMembershipId}/delete`,
            request,
        );
    }

    deleteTeamMembershipHistory(
        teamId: string,
        teamMembershipId: string,
        teamMembershipHistoryId: string,
        request: IDeleteTeamMembershipHistoryRequestDTO,
    ) {
        return this.http.delete<IDeleteTeamMembershipHistoryResponseDTO>(
            `${this._baseUrl}/${teamId}/memberships/${teamMembershipId}/histories/${teamMembershipHistoryId}/delete`,
            request,
        );
    }

    listTeams(request: IListTeamsRequestDTO) {
        const url = new URL(`${this._baseUrl}/`);
        Object.entries(request).forEach(([key, val]) => {
            if (val == null) {
                return;
            }

            url.searchParams.append(key, val);
        });

        return this.http.get<IListTeamsResponseDTO>(url.toString());
    }

    readTeam(teamId: string) {
        return this.http.get<IReadTeamResponseDTO>(`${this._baseUrl}/${teamId}`);
    }

    readTeamPlayer(teamId: string, membershipId: string) {
        return this.http.get<IReadTeamPlayerResponseDTO>(`${this._baseUrl}/${teamId}/memberships/${membershipId}`);
    }

    updateTeam(teamId: string, request: IUpdateTeamRequestDTO) {
        return this.http.put<IUpdateTeamResponseDTO>(`${this._baseUrl}/${teamId}/update`, request);
    }

    updateTeamMembership(teamId: string, playerId: string, request: IUpdateTeamMembershipRequestDTO) {
        return this.http.put<IReadTeamResponseDTO>(`${this._baseUrl}/${teamId}/players/${playerId}/update`, request);
    }

    delete(teamId: string, request: IDeleteTeamRequestDTO) {
        return this.http.delete<IDeleteTeamResponseDTO>(`${this._baseUrl}/${teamId}/delete`);
    }

    listTeamMembershipHistories(
        teamId: string,
        teamMembershipId: string,
        request: IListTeamMembershipHistoriesRequestDTO,
    ) {
        const url = new URL(`${this._baseUrl}/${teamId}/memberships/${teamMembershipId}/histories`);
        Object.entries(request).forEach(([key, val]) => {
            if (val == null) {
                return;
            }

            url.searchParams.append(key, val);
        });

        return this.http.get<IListTeamMembershipHistoriesResponseDTO>(url.toString());
    }

    createTeamMembershipHistory(
        teamId: string,
        teamMembershipId: string,
        request: ICreateTeamMembershipHistoryRequestDTO,
    ) {
        return this.http.post<ICreateTeamMembershipHistoryResponseDTO>(
            `${this._baseUrl}/${teamId}/memberships/${teamMembershipId}/histories/create`,
            request,
        );
    }

    updateTeamMembershipHistory(
        teamId: string,
        teamMembershipId: string,
        teamMembershipHistoryId: string,
        request: IUpdateTeamMembershipHistoryRequestDTO,
    ) {
        return this.http.put<IUpdateTeamMembershipHistoryResponseDTO>(
            `${this._baseUrl}/${teamId}/memberships/${teamMembershipId}/histories/${teamMembershipHistoryId}/update`,
            request,
        );
    }
}
```

### Authentication Interceptor Documentation

Through the use of a HttpInterceptor, the application can automatically attach a auth token to each request, this auth token will be obtained by the AuthService, responsible for logging/registering a user and obtaining the current user.

```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const authToken = localStorage.getItem('auth_token');

        if (authToken) {
            const authReq = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${authToken}`),
            });
            return next.handle(authReq);
        }

        return next.handle(request);
    }
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(private userDataAccess: UserDataAccessService) {
        this.loadCurrentUser().subscribe();
    }

    register(userData: IRegisterUserRequestDTO): Observable<IRegisterUserResponseDTO> {
        return this.userDataAccess.register(userData);
    }

    login(request: ILoginUserRequestDTO) {
        return this.userDataAccess.login(request).pipe(
            tap({
                next: (response) => {
                    localStorage.setItem('auth_token', response.token);
                    this.loadCurrentUser().subscribe();
                },
            }),
        );
    }

    loadCurrentUser(): Observable<User | null> {
        const token = localStorage.getItem('auth_token');
        // console.log("token in load current:", token)

        if (!token) {
            this.currentUserSubject.next(null);
            this.isAuthenticatedSubject.next(false);
            return of(null);
        }

        return this.userDataAccess.getCurrentUser().pipe(
            map((dto) => {
                return dto.user == null ? null : UserMapper.apiModelToDomain(dto.user);
            }),
            tap((user) => {
                this.currentUserSubject.next(user);
                this.isAuthenticatedSubject.next(user != null);
            }),
            catchError((error) => {
                this.logout();
                return of(null);
            }),
        );
    }

    logout(): void {
        localStorage.removeItem('auth_token');
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }
}
```

### Frontend Components & Other Features

##### Mixin Elements

The Application uses "Mixin" elements that can be readily composed through the use of directives.
```ts
@Directive({
    selector: '[appMixinStyledButton]',
    standalone: true,
})
export class MixinStyledButtonDirective implements OnChanges {
    @Input() appMixinStyledButton!: {
        size: 'mixin-Sbutton-sm' | 'mixin-Sbutton-base';
        theme:
            | 'theme-Sbutton-generic-white'
            | 'theme-Sbutton-generic-yellow'
            | 'theme-Sbutton-generic-green'
            | 'theme-Sbutton-generic-red'
            | 'theme-Sbutton-generic-blue';
        hasShadow?: boolean;
        isStatic?: boolean;
        isSharp?: boolean;
    };

    private baseClass = 'mixin-Sbutton-like';
    private previousSize?: string;
    private previousTheme?: string;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        // Apply base class
        this.renderer.addClass(this.el.nativeElement, this.baseClass);

        const { size, theme, hasShadow = false, isStatic = false, isSharp = false } = this.appMixinStyledButton;

        // Apply initial size and theme classes
        if (size) {
            this.renderer.addClass(this.el.nativeElement, size);
            this.previousSize = size;
        }
        if (theme) {
            this.renderer.addClass(this.el.nativeElement, theme);
            this.previousTheme = theme;
        }

        if (hasShadow) {
            this.renderer.addClass(this.el.nativeElement, 'token-default-shadow');
        }

        if (isStatic) {
            this.renderer.addClass(this.el.nativeElement, 'mixin-Sbutton-like--static');
            this.renderer.addClass(this.el.nativeElement, `${theme}--static`);
        }

        if (isSharp) {
            this.renderer.addClass(this.el.nativeElement, 'mixin-Sbutton-like--sharp')
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Handle size changes
        if (changes['size'] && changes['size'].currentValue !== changes['size'].previousValue) {
            if (this.previousSize) {
                this.renderer.removeClass(this.el.nativeElement, this.previousSize);
            }
            this.renderer.addClass(this.el.nativeElement, changes['size'].currentValue);
            this.previousSize = changes['size'].currentValue;
        }

        // Handle theme changes
        if (changes['theme'] && changes['theme'].currentValue !== changes['theme'].previousValue) {
            if (this.previousTheme) {
                this.renderer.removeClass(this.el.nativeElement, this.previousTheme);
            }
            this.renderer.addClass(this.el.nativeElement, changes['theme'].currentValue);
            this.previousTheme = changes['theme'].currentValue;
        }
    }
}
```

##### Layout Directives

In order to enforce consistent site layouts, we make use of directives such as ContentGridDirective or PageDirective to automatically attach all the necessary classes and attributes for the design to work

```ts
@Directive({
    selector: '[appContentGrid]',
})
export class ContentGridDirective implements OnInit {
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, "mixin-content-grid");
    }
}

@Directive({
    selector: '[appPageDirective]',
})
export class PageDirective implements OnInit {
    @Input() appPageDirective!: {
        pageSize: 'mixin-page-base';
        isSubpage?: boolean;
    };

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        const { pageSize, isSubpage = false } = this.appPageDirective;

        this.renderer.addClass(this.el.nativeElement, 'mixin-page-like');
        this.renderer.addClass(this.el.nativeElement, pageSize);

        if (isSubpage) {
            this.renderer.addClass(this.el.nativeElement, 'mixin-page-like--subpage');
        }
    }
}

```

##### Dynamic Results Elements

The app makes use of Dynamic Elements through the use of Angular's *ngComponentOutlet directive, making it possible to make Search/Result forms that will take their own custom Result elements that can accomplish different goals without having to write two separate forms. 

```ts
export class SearchTeamsModalComponent<P extends Record<string, unknown>> implements SearchTeamsModalComponentData<P> {
    readonly ResultComponent: Type<P>;
    propsFactory: (team: Team) => P;

    currentRoute: keyof typeof routes = 'form';
    changeRoute(newRoute: keyof typeof routes) {
        this.currentRoute = newRoute;
    }

    form: FormGroup<IFormControls>;
    results: Team[] = [];

    constructor(
        public dialogRef: DialogRef<Team>,
        @Inject(DIALOG_DATA) data: SearchTeamsModalComponentData<P>,
        private teamDataAccess: TeamDataAccessService,
    ) {
        this.form = new FormGroup<IFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [],
            }),
        });

        this.ResultComponent = data.ResultComponent;
        this.propsFactory = data.propsFactory;
    }

    close() {
        this.dialogRef.close();
    }

    async onFormSubmit() {
        const rawValue = this.form.getRawValue();
        const responseObservable = this.teamDataAccess.listTeams({
            name: rawValue.name,
            limitBy: null,
            teamMembershipPlayerId: null
        });

        responseObservable.subscribe((dto) => {
            this.results = dto.teams.map(TeamMapper.apiModelToDomain);
            this.changeRoute('results');
        });
    }
}

@Component({
    selector: 'app-team-selector-result-component',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CoverImageComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        PanelDirectivesModule,
    ],
    template: `
        <div
            [appMixinStyledCard]="{
                size: 'mixin-Scard-base',
                theme: 'theme-Scard-generic-white',
                hasBorder: true,
                hasDivide: true
            }"
        >
            <section appMixinStyledCardSection class="grid gap-3" style="grid-template: auto / auto 1fr">
                <div class="aspect-square theme-avatar-any">
                    <section class="relative h-full w-full flex">
                        <app-cover-image src=""></app-cover-image>
                    </section>
                </div>
                <div class="overflow-hidden">
                    <div class="token-card--header--primary-text">
                        {{ team.name }}
                    </div>
                </div>
            </section>
            <section appMixinStyledCardSection>
                <div class="token-default-list">
                    <span class="token-default-list__label shrink-0">Id</span>
                    <span class="token-default-list__value truncate">
                        {{ team.id }}
                    </span>
                </div>
                <div class="token-default-list">
                    <span class="token-default-list__label shrink-0">Date Founded</span>
                    <span class="token-default-list__value truncate">
                        {{ team.dateFounded | date }}
                    </span>
                </div>
            </section>
            <footer appMixinStyledCardSection class="grid grid-cols-1 gap-1">
                <button
                    [appMixinStyledButton]="{
                        size: 'mixin-Sbutton-base',
                        theme: 'theme-Sbutton-generic-green'
                    }"
                    *ngIf="isSelected; else notSelected"
                    class="justify-center"
                >
                    Already Selected
                </button>
                <ng-template #notSelected>
                    <button
                        [appMixinStyledButton]="{
                            size: 'mixin-Sbutton-base',
                            theme: 'theme-Sbutton-generic-yellow'
                        }"
                        (click)="selectTeam()"
                        class="justify-center"
                    >
                        Select
                    </button>
                </ng-template>
            </footer>
        </div>
    `,
})
export class TeamSelectResultComponent {
    @Input() team!: Team;
    @Input() selectTeam!: () => void;
    @Input() isSelected!: boolean;
}
```

##### Auth Guards

Usage of auth guards to restrict access to certain parts of the site

```ts
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return this.authService.isAuthenticated$.pipe(
            take(1), 
            map((isAuthenticated) => {
                if (isAuthenticated) {
                    return true
                } else {
                    this.router.navigate(['users/login']);
                    return false;
                }
            }),
        );
    }
}

```

##### Global Error handling and Routable Exceptions

Usage of global error handling to catch errors while loading data and being able to display error pages accordingly; e.g. a 404 occurs, prompting a NotFound site.

```ts
class RoutableException extends Error {
    public readonly type = ROUTABLE_EXCEPTION_TYPE;

    constructor(message: string, route: string) {
        super(message);
        this.route = route;
        this.name = this.constructor.name;
    }

    public route: string;
}

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private _router: Router) {}

    handleError(error: any): void {
        let errorMessage = 'An unexpected error occurred.';
        const errorType = error?.type;

        if (errorType === ROUTABLE_EXCEPTION_TYPE) {
            this._router.navigate([error.route], { state: { error: error.error } });
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = `Unknown error: ${JSON.stringify(error)}`;
        }

        console.error("error that was caught: ", error);
    }
}
```

##### Child Routes & Layouts

The application uses child/nested routes and layouts to create a better user experience.

```ts
class TeamLayoutPageComponent implements OnInit {
    team!: Team;
    teamPlayers!: TeamPlayer[];
    public buttons!: HeaderNavbarButtons;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: ITeamLayoutPageResolverData = this.activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.team = data.team;
        this.teamPlayers = data.teamPlayers;

        this.buttons = [
            { label: 'Details', url: `/teams/${this.team.id}/` },
            { label: 'Memberships', url: `/teams/${this.team.id}/memberships` },
            { label: 'Update', url: `/teams/${this.team.id}/update` },
            { label: 'Create Membership', url: `/teams/${this.team.id}/memberships/add` },
            { label: 'Delete', url: `/teams/${this.team.id}/delete` },
        ];
    }
}

@Injectable({ providedIn: 'root' })
export class TeamLayoutPageResolver implements Resolve<ITeamLayoutPageResolverData> {
    constructor(
        private teamDataAccess: TeamDataAccessService,
        private matchDataAccess: MatchDataAccessService,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ITeamLayoutPageResolverData> {
        let teamId = route.paramMap.get('teamId');

        if (teamId == null) {
            throw new ClientSideErrorException('Read Team Page: teamId parameter is null.');
        }

        const teamData = this.teamDataAccess.readTeam(teamId).pipe(
            map((response) => ({
                team: TeamMapper.apiModelToDomain(response.team),
                teamPlayers: response.teamPlayers.map(TeamPlayerMapper.apiModelToDomain),
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );

        return teamData;
    }
}
```

```html
<div [appPageDirective]="{ pageSize: 'mixin-page-base' }" appContentGrid class="overflow-hidden">
    <app-header-navbar [buttons]="buttons" />
    <app-divider />
    <router-outlet></router-outlet>
</div>
```