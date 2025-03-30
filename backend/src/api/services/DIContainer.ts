import IApiModelService from "api/interfaces/IApiModelService";
import IDatabaseService from "api/interfaces/IDatabaseService";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import IPasswordHasher from "application/interfaces/IPasswordHasher";
import IJwtTokenService from "application/interfaces/IJwtTokenService";
import { Knex } from "knex";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import IClientRepository from "application/interfaces/persistence/IClientRepository";
import IMapperRegistry from "infrastructure/mappers/IMapperRegistry";
import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import IUserRepository from "application/interfaces/persistence/IUserRepository";
import { AsyncLocalStorage } from "async_hooks";
import IUserDomainService from "application/interfaces/domainServices/IUserDomainService";
import IRealEstateListingRepository from "application/interfaces/persistence/IRealEstateListingRepository";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import IDatabaseProviderSingleton from "api/interfaces/IDatabaseProviderSingleton";
import RealEstateListingQueryService from "infrastructure/services/RealEstateListingQueryService";
import ClientQueryService from "infrastructure/services/ClientQueryService";
import IEmailService from "api/interfaces/IEmailService";

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
    DATABASE_PROVIDER_SINGLETON: makeToken<IDatabaseProviderSingleton>("DATABASE_PROVIDER_SINGLETON"),
    KNEX_CLIENT: makeToken<Knex>("KNEX_CLIENT"),
    REQUEST_DISPATCHER: makeToken<IRequestDispatcher>("REQUEST_DISPATCHER"),
    EMAIL_SERVICE: makeToken<IEmailService>("EMAIL_SERVICE"),
    PASSWORD_HASHER: makeToken<IPasswordHasher>("PASSWORD_HASHER"),
    JWT_TOKEN_SERVICE: makeToken<IJwtTokenService>("JWT_TOKEN_SERVICE"),
    API_MODEL_SERVICE: makeToken<IApiModelService>("API_MODEL_SERVICE"),
    CLIENT_DOMAIN_SERVICE: makeToken<IClientDomainService>("CLIENT_DOMAIN_SERVICE"),
    CLIENT_REPOSITORY: makeToken<IClientRepository>("CLIENT_REPOSITORY"),
    REAL_ESTATE_LISTING_REPOSITORY: makeToken<IRealEstateListingRepository>("REAL_ESTATE_LISTING_REPOSITORY"),
    MAPPER_REGISTRY: makeToken<IMapperRegistry>("MAPPER_REGISTRY"),
    DATABASE_CONNECTION: makeToken<IDatabaseConnection>("DATABASE_CONNECTION"),
    UNIT_OF_WORK: makeToken<IUnitOfWork>("UNIT_OF_WORK"),
    USER_REPOSITORY: makeToken<IUserRepository>("USER_REPOSITORY"),
    USER_DOMAIN_SERVICE: makeToken<IUserDomainService>("USER_DOMAIN_SERVICE"),
    REAL_ESTATE_LISTING_DOMAIN_SERVICE: makeToken<IRealEstateListingDomainService>("REAL_ESTATE_LISTING_DOMAIN_SERVICE"),
    REAL_ESTATE_LISTING_QUERY_SERVICE: makeToken<RealEstateListingQueryService>("REAL_ESTATE_LISTING_QUERY_SERVICE"),
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
