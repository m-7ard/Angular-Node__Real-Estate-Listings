import IApiModelService from "api/interfaces/IApiModelService";
import IDatabaseService from "api/interfaces/IDatabaseService";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import IPasswordHasher from "application/interfaces/IPasswordHasher";
import IJwtTokenService from "application/interfaces/IJwtTokenService";
import { Knex } from "knex";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import IClientRepository from "application/interfaces/IClientRepository";
import IMapperRegistry from "infrastructure/mappers/IMapperRegistry";
import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IUnitOfWork from "application/interfaces/IUnitOfWork";
import IUserRepository from "application/interfaces/IUserRepository";
import { AsyncLocalStorage } from "async_hooks";

type TokenType<T> = T extends { __service: infer S } ? S : never;

type TokenMap = typeof DI_TOKENS;
type TokenKeys = keyof TokenMap;
type TokenValues = TokenMap[TokenKeys];

type Factory<T = unknown> = (container: DIContainer) => T;

type ScopeId = string;
type ScopeFactory<T> = (container: DIContainer, scopeId: ScopeId) => T;

type Registration<T = unknown> = { type: "instance"; value: T } | { type: "factory"; value: Factory<T> } | { type: "scoped"; value: ScopeFactory<T> };

const makeToken = <Service>(literal: string) => literal as string & { __service: Service };

export const DI_TOKENS = {
    DATABASE: makeToken<IDatabaseService>("DATABASE"),
    KNEX_QUERY_BUILDER: makeToken<Knex>("KNEX_QUERY_BUILDER"),
    REQUEST_DISPATCHER: makeToken<IRequestDispatcher>("REQUEST_DISPATCHER"),
    PASSWORD_HASHER: makeToken<IPasswordHasher>("PASSWORD_HASHER"),
    JWT_TOKEN_SERVICE: makeToken<IJwtTokenService>("JWT_TOKEN_SERVICE"),
    API_MODEL_SERVICE: makeToken<IApiModelService>("API_MODEL_SERVICE"),
    CLIENT_DOMAIN_SERVICE: makeToken<IClientDomainService>("CLIENT_DOMAIN_SERVICE"),
    CLIENT_REPOSITORY: makeToken<IClientRepository>("CLIENT_REPOSITORY"),
    MAPPER_REGISTRY: makeToken<IMapperRegistry>("MAPPER_REGISTRY"),
    DATABASE_CONNECTION: makeToken<IDatabaseConnection>("DATABASE_CONNECTION"),
    UNIT_OF_WORK: makeToken<IUnitOfWork>("UNIT_OF_WORK"),
    USER_REPOSITORY: makeToken<IUserRepository>("USER_REPOSITORY"),
} as const;

const scopeContext = new AsyncLocalStorage<Map<string, unknown>>();

export class DIContainer {
    private dependencies = new Map<string, Registration<unknown>>();
    private scopedInstances = new Map<ScopeId, Map<string, unknown>>();

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

    private getCurrentScopeId(): ScopeId | undefined {
        const store = scopeContext.getStore();
        if (!store) return undefined;
        return store.get("scopeId") as ScopeId | undefined;
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

            case "scoped": {
                const scopeId = this.getCurrentScopeId();
                if (!scopeId) {
                    throw new Error(`Cannot resolve scoped dependency outside of a scope: ${token}`);
                }

                // Get or create instance map for this scope
                if (!this.scopedInstances.has(scopeId)) {
                    this.scopedInstances.set(scopeId, new Map());
                }

                const scopeMap = this.scopedInstances.get(scopeId)!;

                // Return existing instance if available
                if (scopeMap.has(token as string)) {
                    return scopeMap.get(token as string) as TokenType<K>;
                }

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

    createRequestScopeMiddleware() {
        const container = this;

        return (req: any, res: any, next: Function) => {
            container.runInScope(() => {
                // You can add the scopeId to the request for debugging
                req.scopeId = container.getCurrentScopeId();
                next();
            });
        };
    }
}

const diContainer = new DIContainer();

export default diContainer;
