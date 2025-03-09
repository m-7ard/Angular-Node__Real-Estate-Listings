import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import { err, ok } from "neverthrow";
import ApplicationError from "application/errors/ApplicationError";
import Client from "domain/entities/Client";
import IClientRepository, { FilterClientsCriteria } from "application/interfaces/persistence/IClientRepository";
import ClientId from "domain/valueObjects/Client/ClientId";
import ClientType from "domain/valueObjects/Client/ClientType";

export type FilterClientsQueryResult = IQueryResult<Client[], ApplicationError[]>;

export class FilterClientsQuery implements IQuery<FilterClientsQueryResult> {
    __returnType: FilterClientsQueryResult = null!;

    constructor(params: { id?: string | null; type?: string | null; name?: string | null }) {
        this.id = params.id ?? null;
        this.type = params.type ?? null;
        this.name = params.name ?? null;
    }

    public id: string | null;
    public type: string | null;
    public name: string | null;
}

export default class FilterClientsQueryHandler implements IRequestHandler<FilterClientsQuery, FilterClientsQueryResult> {
    constructor(private readonly clientRepository: IClientRepository) {}

    async handle(query: FilterClientsQuery): Promise<FilterClientsQueryResult> {
        // Clean Input
        if (query.id != null && ClientId.canCreate(query.id).isErr()) {
            query.id = null;
        }

        if (query.type != null && ClientType.canCreate(query.type).isErr()) {
            query.type = null;
        }

        // Lookup
        const criteria = new FilterClientsCriteria({ 
            id: query.id == null ? null : ClientId.executeCreate(query.id), 
            name: query.name, 
            type: query.type == null ? null : ClientType.executeCreate(query.type) 
        })

        const clients = await this.clientRepository.filterAsync(criteria);

        return ok(clients);
    }
}
