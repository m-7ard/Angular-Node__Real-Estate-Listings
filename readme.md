#  Documentation

## Table of Contents
- [Local Setup](#local-setup)
  - [Setup](#setup)
- [Personal Thoughts](#personal-thoughts)
- [Features](#features)
- [Backend Documentation](#backend-documentation)
  - [Core Interfaces and Classes](#core-interfaces-and-classes)
    - [IAction Interface](#iaction-interface)
    - [IActionResponse Interface](#iactionresponse-interface)
    - [JsonResponse Class](#jsonresponse-class)
    - [Example: CreateRealEstateListingAction](#example-createplayeraction)
    - [registerAction Utility](#registeraction-utility)
    - [Dependency Injection System](#dependency-injection-system)
    - [Multi-Environment Application Startup Service](#multi-environment-application-startup-service)
    - [Request Dispatcher (CQRS)](#request-dispatcher-cqrs)
    - [Application Layer Validator / Services](#application-layer-validator--services)
    - [IDatabaseService](#idatabaseservice)
    - [Database Models and Schema Interfaces](#database-models-and-schema-interfaces)
    - [Repositories](#repositories)
    - [Api Models](#api-models)
  - [Integration Test Setup Documentation](#integration-testing-setup-documentation)
    - [Key Functions](#key-functions)
    - [Usage Example](#usage-example)
- [Frontend Documentation](#frontend-documentation)
  - [Data Access](#data-access-documentation)
  - [Authentication Interceptor](#authentication-interceptor-documentation)
  - [Components & Features](#frontend-components--other-features)
    - [Mixin Elements](#mixin-elements)
    - [Layout Directives](#layout-directives)
    - [Auth Guards](#auth-guards)
    - [Global Error handling & Routable Exceptions](#global-error-handling--routable-exceptions)

## Run Locally

### Setup

1. Clone the project
```bash
git clone https://github.com/m-7ard/Angular-Node__Real-Estate-Listings.git
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

## Personal Thoughts
30 / 03 / 2025: When I first created this project I decided to take the technical decision of using Domain Driven Design for my data-models in this project, however, as the project materialised, it proved to be rather unecessary, as there were no complex relationships, nor business rules, and arguably had little to no benefits in this project. If I were to redesign it, I would probably just make it a 2 layer architecture, with a presentation and db model.

JSON Schema proved very effective, and I will probably keep on using it from here on out. It made sharing DTOs a lot easier.

I have somewhat fallen out of love with the IRequestDispatcher, since it forces us to use a DI Container with scoped service support, which, while very nice and cool, required quite a lot of fiddling to figure out (e.g figuring out how the scoped worked, how to provide a service to the tests if they're not in the request-response cycle). If it weren't for this pattern, we would be able to just pass the database connection manually through the Action when we instantiate it. However, it is an undeniably powerful pattern nevertheless, and I'll probably keep using it.

## Features

- Manage Clients & Real Estate Listings
- User authentication using JWTs
- Frontend interceptors for managing request authorization headers
- Separation between Domain Models, Api Models, Db Models & Db Schemas
- Separation of concerns for data fetching in the frontend
- Global error handling
- Backend Integration Tests
- Backend endpoint guards (e.g auth guards)
- Layered architecture & Light Domain-Driven Design (DDD) methodology
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

##### Example: CreateRealEstateListingAction

Demonstrates handling real estate listing creation, including validation, command dispatch, and response generation:

```typescript
type ActionRequest = { dto: CreateRealEstateListingRequestDTO };
type ActionResponse = JsonResponse<CreateRealEstateListingResponseDTO | IApiError[]>;

class CreateRealEstateListingAction implements IAction<ActionRequest, ActionResponse> {
    constructor(private readonly _requestDispatcher: IRequestDispatcher) {}

    async handle(request: ActionRequest): Promise<ActionResponse> {
        const { dto } = request;

        const isValid = CreateRealEstateListingRequestDTOValidator(dto);
        if (!isValid) {
            return new JsonResponse({
                status: StatusCodes.BAD_REQUEST,
                body: ApiErrorFactory.mapAjvErrors(CreateRealEstateListingRequestDTOValidator.errors),
            });
        }

        const guid = crypto.randomUUID();

        const command = new CreateRealEstateListingCommand({
            id: guid,
            city: dto.city,
            clientId: dto.clientId,
            country: dto.country,
            price: dto.price,
            state: dto.state,
            street: dto.street,
            type: dto.type,
            zip: dto.zip,
            info: {
                squareMeters: dto.squareMeters,
                yearBuilt: dto.yearBuilt,
                bathroomNumber: dto.bathroomNumber,
                bedroomNumber: dto.bedroomNumber,
                description: dto.description,
                flooringType: dto.flooringType,
            },
            title: dto.title,
            images: dto.images,
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
                city: request.body.city,
                clientId: request.body.clientId,
                country: request.body.country,
                price: typeof request.body.price === "number" && Number.isFinite(request.body.price) ? request.body.price : -1,
                state: request.body.state,
                street: request.body.street,
                type: request.body.type,
                zip: request.body.zip,
                squareMeters: request.body.squareMeters,
                yearBuilt: request.body.yearBuilt,
                bathroomNumber: request.body.bathroomNumber,
                bedroomNumber: request.body.bedroomNumber,
                description: request.body.description,
                flooringType: request.body.flooringType,
                title: request.body.title,
                images: request.body.images,
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

Registers and manages dependencies in a Map, it leverages Typescript's branded types to use DI tokens to automatically get the interface of each service we're registering or resolving; It automatically manages scoped services through Node's AsyncLocalStorage:

```ts
type TokenType<T> = T extends { __service: infer S } ? S : never;

type TokenMap = typeof DI_TOKENS;
type TokenKeys = keyof TokenMap;
type TokenValues = TokenMap[TokenKeys];

type Factory<T = unknown> = (container: ProductionDIContainer) => T;

type ScopeId = string;
type ScopeFactory<T> = (container: ProductionDIContainer, scopeId: ScopeId) => T; // We don't really need the scopeId

type Registration<T = unknown> = { type: "instance"; value: T } | { type: "factory"; value: Factory<T> } | { type: "scoped"; value: ScopeFactory<T> };

const makeToken = <Service>(literal: string) => literal as string & { __service: Service };

export const DI_TOKENS = {
    DATABASE: makeToken<IDatabaseService>("DATABASE"),
    ...,
    CLIENT_QUERY_SERVICE: makeToken<ClientQueryService>("CLIENT_QUERY_SERVICE"),
} as const;

const scopeContext = new AsyncLocalStorage<Map<string, unknown>>();

class UnregisteredDependencyError extends Error {};

export interface IDIContainer {
    register<K extends TokenValues>(token: K, instance: TokenType<K>): void;
    registerFactory<K extends TokenValues>(token: K, factory: Factory<TokenType<K>>): void;
    registerScoped<K extends TokenValues>(token: K, factory: ScopeFactory<TokenType<K>>): void;
    registerScopedInstance<K extends TokenValues>(token: K, instance: TokenType<K>): void;
    resolve<K extends TokenValues>(token: K): TokenType<K>;
    runInScope<T>(fn: () => T): T;
    getCurrentScopeId(): ScopeId | undefined
}

export class ProductionDIContainer implements IDIContainer {
    protected dependencies = new Map<string, Registration<unknown>>();
    protected scopedInstances = new Map<ScopeId, Map<string, unknown>>();

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

    registerScoped<K extends TokenValues>(token: K, factory: ScopeFactory<TokenType<K>>): void {
        this.dependencies.set(token as string, {
            type: "scoped",
            value: factory,
        });
    }

    getCurrentScopeId(): ScopeId | undefined {
        const store = scopeContext.getStore();
        if (!store) return undefined;
        return store.get("scopeId") as ScopeId | undefined;
    }

    registerScopedInstance<K extends TokenValues>(token: K, instance: TokenType<K>): void {
        const scopeId = this.getCurrentScopeId();
        if (!scopeId) {
            throw new Error(`Cannot register scoped instance outside of a scope: ${token}`);
        }

        // Get or create the scope's instance map
        if (!this.scopedInstances.has(scopeId)) {
            this.scopedInstances.set(scopeId, new Map());
        }

        const scopeMap = this.scopedInstances.get(scopeId)!;
        scopeMap.set(token as string, instance);
    }

    resolve<K extends TokenValues>(token: K): TokenType<K> {
        const scopeId = this.getCurrentScopeId();
        
        // If we're in a scope, check for scope-specific instances first
        if (scopeId && this.scopedInstances.has(scopeId)) {
            const scopeMap = this.scopedInstances.get(scopeId)!;
            if (scopeMap.has(token as string)) {
                return scopeMap.get(token as string) as TokenType<K>;
            }
        }
        
        // Fall back to the global registration logic
        const registration = this.dependencies.get(token as string);

        if (!registration) {
            throw new UnregisteredDependencyError(`Dependency not registered: ${token}`);
        }

        switch (registration.type) {
            case "instance":
                return registration.value as TokenType<K>;

            case "factory":
                return registration.value(this) as TokenType<K>;

            case "scoped": {
                if (!scopeId) {
                    throw new UnregisteredDependencyError(`Cannot resolve scoped dependency outside of a scope: ${token}`);
                }

                // Get or create instance map for this scope
                if (!this.scopedInstances.has(scopeId)) {
                    this.scopedInstances.set(scopeId, new Map());
                }

                const scopeMap = this.scopedInstances.get(scopeId)!;

                // Create and store new instance
                const instance = registration.value(this, scopeId) as TokenType<K>;
                scopeMap.set(token as string, instance);
                return instance;
            }

            default:
                throw new Error(`Unknown registration type for: ${token}`);
        }
    }

    runInScope<T>(fn: () => T): T {
        const scopeId = `scope-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const store = new Map<string, unknown>([["scopeId", scopeId]]);

        try {
            return scopeContext.run(store, () => fn());
        } finally {
            // Clean up instances when scope ends
            this.scopedInstances.delete(scopeId);
        }
    }
}

export class TestingDIContainer extends ProductionDIContainer {
    private __testResolveFlag: boolean = false;
    private readonly testingDependencies = new Map<string, unknown>();

    constructor(testingDependencies: { connection: IDatabaseConnection }) {
        super();
        this.testingDependencies.set(DI_TOKENS.DATABASE_CONNECTION, testingDependencies.connection);
    }

    updateConnection(connection: IDatabaseConnection) {
        this.testingDependencies.set(DI_TOKENS.DATABASE_CONNECTION, connection);
    }

    resolve<K extends TokenValues>(token: K): TokenType<K> {
        try {
            return super.resolve(token);
        } catch (err: unknown) {
            if (err instanceof UnregisteredDependencyError) {
                if (!this.__testResolveFlag) throw new Error(err.message);
                const dependency = this.testingDependencies.get(token);
                if (dependency == null) throw new Error("Testing dependency does not exist.");
                return dependency as TokenType<K>;
            }

            throw err;
        }
    }

    testResolve<K extends TokenValues>(token: K): TokenType<K> {
        this.__testResolveFlag = true;
        const dependency = this.resolve(token);
        this.__testResolveFlag = false;
        return dependency;
    }
}
```

##### Multi-Environment Application startup service

Instead of using a single file to manage our server, we use a function that takes a config to start our server, effectively letting us create different environments for testing, production and development purposes without having to change the implementation of any of our existing infrastructure:

```ts
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
    app.use(cors());
    dotenv.config({ path: path.join(DIST_DIR, ".env.API_KEYS") });

    // Database
    diContainer.register(DI_TOKENS.DATABASE, database);

    if (config.database instanceof MySQLDatabaseService) {
        diContainer.register(DI_TOKENS.DATABASE_PROVIDER_SINGLETON, new DatabaseProviderSingleton(DatabaseProviderSingletonValue.MySQL));
    } else {
        throw new Error(`No DatabaseProviderSingleton configuration has been set up for database of type "${config.database.constructor.name}".`);
    }

    diContainer.registerFactory(DI_TOKENS.UNIT_OF_WORK, (container) => {
        const connection = container.resolve(DI_TOKENS.DATABASE_CONNECTION);
        const userRepo = container.resolve(DI_TOKENS.USER_REPOSITORY);
        const clientRepo = container.resolve(DI_TOKENS.CLIENT_REPOSITORY);
        const realEstateListingRepo = container.resolve(DI_TOKENS.REAL_ESTATE_LISTING_REPOSITORY);

        return new UnitOfWork(connection, userRepo, clientRepo, realEstateListingRepo);
    });

    // Query Builder
    const queryBuilder = knex({ client: "mysql2" });
    diContainer.register(DI_TOKENS.KNEX_CLIENT, queryBuilder);

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
    });

    diContainer.registerFactory(DI_TOKENS.USER_DOMAIN_SERVICE, (container) => {
        const unitOfWork = container.resolve(DI_TOKENS.UNIT_OF_WORK);
        const passwordHasher = container.resolve(DI_TOKENS.PASSWORD_HASHER);
        return new UserDomainService(unitOfWork, passwordHasher);
    });

    diContainer.registerFactory(DI_TOKENS.REAL_ESTATE_LISTING_DOMAIN_SERVICE, (container) => {
        const unitOfWork = container.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new RealEstateListingDomainService(unitOfWork);
    });

    diContainer.register(DI_TOKENS.MAPPER_REGISTRY, { clientMapper: new MySQLClientMapper(), userMapper: new MySQLUserMapper(), realEstateListingMapper: new MySQLRealEstateListingMapper() });

    diContainer.registerFactory(DI_TOKENS.REAL_ESTATE_LISTING_QUERY_SERVICE, (container) => {
        const connection = container.resolve(DI_TOKENS.DATABASE_CONNECTION);
        const databaseProviderSingleton = container.resolve(DI_TOKENS.DATABASE_PROVIDER_SINGLETON);
        const knex = container.resolve(DI_TOKENS.KNEX_CLIENT);
        const mapperRegistry = container.resolve(DI_TOKENS.MAPPER_REGISTRY);
        return new RealEstateListingQueryService(connection, databaseProviderSingleton, knex, mapperRegistry);
    });

    diContainer.registerFactory(DI_TOKENS.CLIENT_QUERY_SERVICE, (container) => {
        const connection = container.resolve(DI_TOKENS.DATABASE_CONNECTION);
        const databaseProviderSingleton = container.resolve(DI_TOKENS.DATABASE_PROVIDER_SINGLETON);
        const knex = container.resolve(DI_TOKENS.KNEX_CLIENT);
        const mapperRegistry = container.resolve(DI_TOKENS.MAPPER_REGISTRY);
        return new ClientQueryService(connection, databaseProviderSingleton, knex, mapperRegistry);
    });

    // Repositories
    diContainer.registerFactory(DI_TOKENS.CLIENT_REPOSITORY, (container) => {
        const connection = container.resolve(DI_TOKENS.DATABASE_CONNECTION);
        const registry = container.resolve(DI_TOKENS.MAPPER_REGISTRY);
        const queryService = container.resolve(DI_TOKENS.CLIENT_QUERY_SERVICE);
        return new ClientRepository(connection, registry, queryService);
    });

    diContainer.registerFactory(DI_TOKENS.USER_REPOSITORY, (container) => {
        const connection = container.resolve(DI_TOKENS.DATABASE_CONNECTION);
        const registry = container.resolve(DI_TOKENS.MAPPER_REGISTRY);
        return new UserRepository(connection, registry);
    });

    diContainer.registerFactory(DI_TOKENS.REAL_ESTATE_LISTING_REPOSITORY, (container) => {
        const connection = container.resolve(DI_TOKENS.DATABASE_CONNECTION);
        const registry = container.resolve(DI_TOKENS.MAPPER_REGISTRY);
        const queryService = container.resolve(DI_TOKENS.REAL_ESTATE_LISTING_QUERY_SERVICE);
        return new RealEstateListingRepository(connection, registry, queryService);
    });

    diContainer.register(DI_TOKENS.EMAIL_SERVICE, new ResendEmailService(process.env.RESEND_API_KEY))

    // Request Dispatcher
    const dispatcher = createRequestDispatcher(diContainer);
    diContainer.register(DI_TOKENS.REQUEST_DISPATCHER, dispatcher);

    app.use(express.json({ limit: 1028 ** 2 * 100 }));
    app.use(express.urlencoded({ extended: false }));
    config.middleware.forEach((middleware) => {
        app.use(middleware);
    });

    app.use(createRequestScopeMiddleware(diContainer));
    app.use(connectionProviderMiddlewareFactory(diContainer));

    app.use("/api/", createOtherRouter(diContainer));
    app.use("/api/users/", createUsersRouter(diContainer));
    app.use("/api/clients/", createClientsRouter(diContainer));
    app.use("/api/real-estate-listings/", createRealEstateListingsRouter(diContainer));

    app.use("/media", express.static("media"));
    app.use("/static", express.static("static"));
    app.use(errorLogger);

    app.use(express.static(STATIC_DIR));

    const upload = multer({ storage: multer.memoryStorage() });
    app.post("/api/upload", upload.array("file"), (req, res) => {
        // Files
        const files = req.files as Express.Multer.File[] | null;
        if (files == null || files.length === 0) {
            res.status(StatusCodes.BAD_REQUEST).json(ApiErrorFactory.createSingleErrorList({ message: "Must upload at least 1 file.", path: "_", code: API_ERROR_CODES.VALIDATION_ERROR }));
            return;
        }

        if (files.length > 8) {
            res.status(StatusCodes.BAD_REQUEST).json(ApiErrorFactory.createSingleErrorList({ message: "Cannot upload more than 8 files.", path: "_", code: API_ERROR_CODES.VALIDATION_ERROR }));
            return;
        }

        // File Formats
        const mimeTypeErrors: IApiError[] = [];
        files.forEach((file) => {
            if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
                mimeTypeErrors.push({ message: `${file.originalname}: Can only upload .jpeg and .png files.`, path: file.originalname, code: API_ERROR_CODES.VALIDATION_ERROR });
            }
        });

        if (mimeTypeErrors.length > 0) {
            res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).json(mimeTypeErrors);
            return;
        }

        // File Size
        const payloadLengthErrors: IApiError[] = [];
        files.forEach((file) => {
            if (file.size > 8_388_608) {
                payloadLengthErrors.push({ message: `${file.originalname}: Image size cannot be larger than 8MB.`, path: file.originalname, code: API_ERROR_CODES.VALIDATION_ERROR });
            }
        });

        if (payloadLengthErrors.length > 0) {
            res.status(StatusCodes.REQUEST_TOO_LONG).json(payloadLengthErrors);
            return;
        }

        // Save Images
        const response: UploadImagesResponseDTO = { images: [] };

        files.forEach((file) => {
            const generatedFilename = crypto.randomUUID();
            const extension = path.extname(file.originalname);
            const url = generatedFilename + extension;

            const uploadPath = path.join(MEDIA_ROOT, url);
            try {
                writeFileSync(uploadPath, file.buffer);
            } catch (e) {
                throw e;
            }

            response.images.push({ url: `${req.protocol}://` + path.join(`${req.hostname}:${req.socket.localPort}`.toString(), MEDIA_FOLDER_NAME, url) });
        });

        res.json(response);
    });

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

##### Application Layer Services

The application layer makes use of Domain Services to easily reuse application layer logic

```ts
class RealEstateListingDomainService implements IRealEstateListingDomainService {
    constructor(private readonly unitOfWork: IUnitOfWork) {}

    async tryOrchestractCreateNewListing(contract: OrchestrateCreateNewListingContract): Promise<Result<RealEstateListing, ApplicationError>> {
        const createClientContract: CreateRealEstateListingContract = {
            city: contract.city,
            clientId: contract.clientId,
            country: contract.country,
            dateCreated: new Date(),
            id: contract.id,
            price: contract.price,
            state: contract.state,
            street: contract.street,
            type: contract.type,
            zip: contract.zip,
            squareMeters: contract.squareMeters,
            yearBuilt: contract.yearBuilt,
            bathroomNumber: contract.bathroomNumber,
            bedroomNumber: contract.bedroomNumber,
            description: contract.description,
            flooringType: contract.flooringType,
            title: contract.title,
            images: contract.images
        };

        const canCreateListing = RealEstateListing.canCreate(createClientContract);
        if (canCreateListing.isError()) return err(new CannotCreateRealEstateListingError({ message: canCreateListing.error.message, path: [] }));

        const listing = RealEstateListing.executeCreate(createClientContract);
        await this.unitOfWork.realEstateListingRepo.createAsync(listing);

        return ok(listing);
    }

    async tryOrchestractUpdateListing(listing: RealEstateListing, contract: OrchestrateUpdateListingContract): Promise<Result<boolean, ApplicationError>> {
        const updateContract: UpdateRealEstateListingContract = {
            city: contract.city,
            clientId: contract.clientId,
            country: contract.country,
            id: listing.id.value,
            price: contract.price,
            state: contract.state,
            street: contract.street,
            type: contract.type,
            zip: contract.zip,
            squareMeters: contract.squareMeters,
            yearBuilt: contract.yearBuilt,
            bathroomNumber: contract.bathroomNumber,
            bedroomNumber: contract.bedroomNumber,
            description: contract.description,
            flooringType: contract.flooringType,
            title: contract.title,
            images: contract.images
        };
        const canUpdate = listing.canUpdate(updateContract);

        if (canUpdate.isError()) return err(new CannotUpdateRealEstateListingError({ message: canUpdate.error.message }));

        listing.executeUpdate(updateContract);
        await this.unitOfWork.realEstateListingRepo.updateAsync(listing);
        return ok(true);
    }

    async tryGetById(id: string): Promise<Result<RealEstateListing, ApplicationError>> {
        // Create Client Id
        const createClientId = RealEstateListingId.canCreate(id);
        if (createClientId.isError()) return err(new CannotCreateRealEstateListingIdError({ message: createClientId.error.message }));

        const clientId = RealEstateListingId.executeCreate(id);

        // Fetch Listing
        const listing = await this.unitOfWork.realEstateListingRepo.getByIdAsync(clientId);
        if (listing == null) return err(new RealEstateListingDoesNotExistError({ message: `Real Estate of Id "${id} does not exist."` }));

        return ok(listing);
    }
}
```

##### IDatabaseService

An interface that all database services must implement, this is currently implemented only by MySQLDatabaseService. These classes are in charge of initialising, querying and disposing of the database.

The MySQLDatabaseService will always drop any existing database and then create a new one through the SQL migration files located in /backend/sql. These migration files are prefixed by a XXX pattern where X is a number, it will use this number to order the migrations.

```ts
export type TResultHeader = { affectedRows: number; }

interface IDatabaseService {
    initialise(migrations: string[]): Promise<void>;
    dispose(): Promise<void>;
    getConnection(): Promise<IDatabaseConnection>;
    queryRows<T>(args: { statement: string }): Promise<T[]>;
    queryHeaders(args: { statement: string }): Promise<TResultHeader>;
    executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]>;
    executeHeaders<T>(args: { statement: string; parameters: Array<unknown> }): Promise<TResultHeader>;
}

class MySQLDatabaseService implements IDatabaseService {
    private pool: mysql.Pool;
    private readonly config: mysql.PoolOptions;
    private readonly name: string;

    constructor(config: mysql.PoolOptions, name: string) {
        this.pool = mysql.createPool(config);
        this.config = config;
        this.name = name;
    }

    async getConnection(): Promise<IDatabaseConnection> {
        return new MySQLDatabaseConnection(await this.pool.getConnection());
    }

    async initialise(migrations: string[]): Promise<void> {
        await this.pool.query(`DROP DATABASE IF EXISTS ${this.name}`);
        await this.pool.query(`CREATE DATABASE ${this.name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

        this.pool.end();
        this.pool = mysql.createPool({ ...this.config, database: this.name });

        for (const migration of migrations) {
            await this.pool.query(migration);
        }
    }

    async dispose(): Promise<void> {
        await this.pool.query(`DROP DATABASE IF EXISTS ${this.name}`);
    }

    async queryRows<T>(args: { statement: string }): Promise<T[]> {
        const { statement } = args;
        const [query] = await this.pool.query<T[] & mysql.RowDataPacket[]>(statement);
        return query;
    }

    async queryHeaders(args: { statement: string }): Promise<TResultHeader> {
        const { statement } = args;
        const [query] = await this.pool.query<TResultHeader & mysql.RowDataPacket[]>(statement);
        return { affectedRows: query.affectedRows };
    }

    async executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]> {
        const { statement, parameters } = args;
        const [query] = await this.pool.execute<T[] & mysql.RowDataPacket[]>(statement, parameters);
        return query;
    }

    async executeHeaders(args: { statement: string; parameters: Array<unknown> }): Promise<TResultHeader> {
        const { statement, parameters } = args;
        const [query] = await this.pool.execute<mysql.ResultSetHeader & mysql.RowDataPacket[]>(statement, parameters);
        return { affectedRows: query.affectedRows };
    }
}
```

##### Database Models and Schema Interfaces

Each database table has a Schema Interface representing its database column types and a Database Model, representing its in memory representation, transforming database column types to desired TS types. There are database-specific schemas, meant for future database cross-compatibilty implementation.

```ts
export default interface IMySQLRealEstateListingSchema {
    id: string;
    type: string;
    price: number;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    client_id: IMySQLClientSchema["id"];
    date_created: Date;
    title: string;
    square_meters: number;
    year_built: number;
    bathroom_number: number;
    bedroom_number: number;
    description: string;
    flooring_type: string;
    images: string[];
}

class RealEstateListingDbEntity {
    constructor(contract: RealEstateListingDbEntityContract) {
        this.bathroom_number = contract.bathroom_number;
        this.bedroom_number = contract.bedroom_number;
        this.city = contract.city;
        this.client_id = contract.client_id;
        this.country = contract.country;
        this.date_created = contract.date_created;
        this.description = contract.description;
        this.flooring_type = contract.flooring_type;
        this.id = contract.id;
        this.price = contract.price;
        this.square_meters = contract.square_meters;
        this.state = contract.state;
        this.street = contract.street;
        this.title = contract.title;
        this.type = contract.type;
        this.year_built = contract.year_built;
        this.zip = contract.zip;
        this.images = contract.images;
    }

    public bathroom_number: number;
    public bedroom_number: number;
    public city: string;
    public client_id: ClientDbEntity["id"];
    public country: string;
    public date_created: Date;
    public description: string;
    public flooring_type: string;
    public id: string;
    public price: number;
    public square_meters: number;
    public state: string;
    public street: string;
    public title: string;
    public type: string;
    public year_built: number;
    public zip: string;
    public images: string[];

    public static readonly TABLE_NAME = "real_estate_listings";

    public getInsertEntry() {
        return sql`
            INSERT INTO ${raw(RealEstateListingDbEntity.TABLE_NAME)} 
            (
                id,
                type,
                price,
                street,
                city,
                state,
                zip,
                country,
                client_id,
                date_created,
                title,
                square_meters,
                year_built,
                bathroom_number,
                bedroom_number,
                description,
                flooring_type,
                images
            )
            VALUES 
            (
                ${this.id}, 
                ${this.type}, 
                ${this.price}, 
                ${this.street}, 
                ${this.city}, 
                ${this.state}, 
                ${this.zip}, 
                ${this.country}, 
                ${this.client_id}, 
                ${this.date_created},
                ${this.title},
                ${this.square_meters},
                ${this.year_built},
                ${this.bathroom_number},
                ${this.bedroom_number},
                ${this.description},
                ${this.flooring_type},
                ${JSON.stringify(this.images)}
            )
        `;
    }

    public getUpdateEntry() {
        return sql`
            UPDATE ${raw(RealEstateListingDbEntity.TABLE_NAME)} 
            SET 
                id = ${this.id}, 
                type = ${this.type}, 
                price = ${this.price}, 
                street = ${this.street}, 
                city = ${this.city}, 
                state = ${this.state}, 
                zip = ${this.zip}, 
                country = ${this.country}, 
                client_id = ${this.client_id}, 
                date_created = ${this.date_created},
                title = ${this.title}, 
                square_meters = ${this.square_meters}, 
                year_built = ${this.year_built}, 
                bathroom_number = ${this.bathroom_number}, 
                bedroom_number = ${this.bedroom_number}, 
                description = ${this.description}, 
                flooring_type = ${this.flooring_type},
                images = ${JSON.stringify(this.images)}
            WHERE
                id = ${this.id}
        `;
    }

    public static getByIdStatement(id: RealEstateListingDbEntity["id"]) {
        return sql`
            SELECT * FROM ${raw(RealEstateListingDbEntity.TABLE_NAME)} 
            WHERE id = ${id}
        `;
    }

    public getDeleteStatement() {
        return sql`
            DELETE FROM ${raw(RealEstateListingDbEntity.TABLE_NAME)} 
            WHERE id = ${this.id}
        `;
    }
}
```

#####  Repositories

To persist aggregates, the application uses Repositories, due to the plain nature of the aggregates, there are no domain models.

```ts
class RealEstateListingRepository implements IRealEstateListingRepository {
    constructor(private readonly db: IDatabaseConnection, private readonly mapperRegistry: IMapperRegistry, private readonly queryService: RealEstateListingQueryService) {}

    async createAsync(listing: RealEstateListing) {
        const dbEntity = this.mapperRegistry.realEstateListingMapper.domainToDbEntity(listing);
        const insertEntry = dbEntity.getInsertEntry();

        await this.db.executeHeaders({ statement: insertEntry.sql, parameters: insertEntry.values });
    };


    async updateAsync(listing: RealEstateListing): Promise<void> {
        const writeDbEntity = this.mapperRegistry.realEstateListingMapper.domainToDbEntity(listing);
        const entry = writeDbEntity.getUpdateEntry();

        const headers = await this.db.executeHeaders({ statement: entry.sql, parameters: entry.values });
   
        if (headers.affectedRows === 0) {
            throw Error(`No ${RealEstateListingDbEntity.TABLE_NAME} of id "${writeDbEntity.id}" was updated."`);
        }
    };

    async getByIdAsync(id: RealEstateListingId): Promise<RealEstateListing | null> {
        const entry = RealEstateListingDbEntity.getByIdStatement(id.value);
        const [row] = await this.db.executeRows<object | null>({ statement: entry.sql, parameters: entry.values });

        if (row == null) {
            return null;
        }
        
        const listing = this.mapperRegistry.realEstateListingMapper.schemaToDbEntity(row);
        return listing == null ? null : this.mapperRegistry.realEstateListingMapper.dbEntityToDomain(listing);
    };

    async deleteAsync(listing: RealEstateListing): Promise<void> {
        const dbEntity = this.mapperRegistry.realEstateListingMapper.domainToDbEntity(listing);
        const entry = dbEntity.getDeleteStatement();

        const headers = await this.db.executeHeaders({ statement: entry.sql, parameters: entry.values });
   
        if (headers.affectedRows === 0) {
            throw Error(`No ${RealEstateListingDbEntity.TABLE_NAME} of id "${dbEntity.id}" was deleted."`);
        }
    };
    
    async filterAsync(criteria: FilterRealEstateListingsCriteria): Promise<RealEstateListing[]> {
        const dbEntities = await this.queryService.filter({ city: criteria.city, clientId: criteria.clientId == null ? null : criteria.clientId.value, country: criteria.country, maxPrice: criteria.maxPrice == null ? null : criteria.maxPrice.value, minPrice: criteria.minPrice == null ? null : criteria.minPrice.value, state: criteria.state, type: criteria.type == null ? null : criteria.type.value, zip: criteria.zip })
        return dbEntities.map(this.mapperRegistry.realEstateListingMapper.dbEntityToDomain);
    };
}
```

##### Api Models

Instead of returning a raw Domain Model and leaking business data, the Api returns Api models.

```ts
class ApiModelMapper {
    public static createUserApiModel(user: User): UserAPIModel {
        return {
            id: user.id.value,
            email: user.email.value,
            name: user.name,
            isAdmin: user.isAdmin,
        };
    }

    public static createClientApiModel(client: Client): ClientAPIModel {
        return {
            id: client.id.value,
            name: client.name,
            type: client.type.value,
        };
    }

    public static createRealEstateListingApiModel(listing: RealEstateListing): RealEstateListingAPIModel {
        return {
            id: listing.id.value,
            city: listing.address.city,
            clientId: listing.clientId.value,
            country: listing.address.country,
            dateCreated: listing.dateCreated,
            price: listing.price.value,
            state: listing.address.state,
            street: listing.address.street,
            type: listing.type.value,
            zip: listing.address.zip,
            squareMeters: listing.info.squareMeters,
            yearBuilt: listing.info.yearBuilt,
            bathroomNumber: listing.info.bathroomNumber,
            bedroomNumber: listing.info.bedroomNumber,
            description: listing.info.description,
            flooringType: listing.info.flooringType,
            title: listing.title,
            images: listing.images
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
let ADMIN: User;
let ADMIN_PASSWORD: string;
let DEFAULT_REQUEST: CreateRealEstateListingRequestDTO;
let CLIENT_001: Client;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    const mixins = new Mixins();
    CLIENT_001 = await mixins.createPrivateClient(1);

    DEFAULT_REQUEST = {
        city: "city",
        clientId: CLIENT_001.id.value,
        country: "country",
        price: 1,
        state: "state",
        street: "street",
        type: RealEstateListingType.HOUSE.value,
        zip: "zip",
        squareMeters: 1,
        yearBuilt: 2025,
        bathroomNumber: 1,
        bedroomNumber: 1,
        description: "description",
        flooringType: "flooringType",
        title: "title",
        images: []
    };

    const admin =  await mixins.createAdminUser(1);
    ADMIN = admin.user;
    ADMIN_PASSWORD = admin.password;
});

describe("createRealEstateListingsIntegrationTest;", () => {
    it("Create Real Estate Listings; Valid Data; Success;", async () => {
        // Setup

        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .post(`/api/real-estate-listings/create`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });

        // Assert
        expect(response.status).toBe(201);

        const body: CreateRealEstateListingResponseDTO = response.body;
        const repo = testingDIContainer.testResolve(DI_TOKENS.REAL_ESTATE_LISTING_REPOSITORY);
        const listing = await repo.getByIdAsync(RealEstateListingId.executeCreate(body.id))
        expect(listing).not.toBeNull();
    });

    it("Create Real Estate Listings; Client Does Not Exist; Failure;", async () => {        
        // Setup
        DEFAULT_REQUEST.clientId = "bunk client id";
                
        // Act
        const response = await authSupertest({
            agent: supertest(server)
                .post(`/api/real-estate-listings/create`)
                .send(DEFAULT_REQUEST)
                .set("Content-Type", "application/json"),
            user: ADMIN,
            plainPassword: ADMIN_PASSWORD,
        });
        
        // Assert
        expect(response.status).toBe(400);
    });
});

```

## Frotnend Documentation

### Data Access Documentation

The application uses injectable data access in order to access the API, this data access utilises the shared DTO models between Api and the frontend (These need to be copied manually).

```ts
@Injectable({
    providedIn: 'root',
})
export class RealEstateListingDataAccessService {
    private readonly baseUrl = `${environment.apiUrl}/api/real-estate-listings`;
    constructor(private http: HttpClient) {}

    create(request: CreateRealEstateListingRequestDTO) {
        return this.http.post<CreateRealEstateListingResponseDTO>(`${this.baseUrl}/create`, request);
    }

    delete(id: string, request: DeleteRealEstateListingRequestDTO) {
        return this.http.delete<DeleteRealEstateListingResponseDTO>(`${this.baseUrl}/${id}/delete`, { body: request });
    }

    deleteMany(request: DeleteManyRealEstateListingsRequestDTO) {
        const url = urlWithQuery(`${this.baseUrl}/delete`, request)
        return this.http.delete<DeleteRealEstateListingResponseDTO>(url);
    }

    list(request: ListRealEstateListingsRequestDTO) {
        const url = urlWithQuery(`${this.baseUrl}`, request);
        return this.http.get<ListRealEstateListingsResponseDTO>(url);
    }

    read(id: string) {
        return this.http.get<ReadRealEstateListingResponseDTO>(`${this.baseUrl}/${id}`);
    }

    update(id: string, request: UpdateRealEstateListingRequestDTO) {
        return this.http.put<UpdateRealEstateListingResponseDTO>(`${this.baseUrl}/${id}/update`, request);
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
    selector: '[appPageDirective]',
    standalone: true
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
