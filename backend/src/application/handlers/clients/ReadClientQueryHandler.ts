import { IRequestHandler } from "../IRequestHandler";
import IQuery, { IQueryResult } from "../IQuery";
import { err, ok } from "neverthrow";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import ApplicationError from "application/errors/ApplicationError";
import Client from "domain/entities/Client";

export type ReadClientQueryResult = IQueryResult<Client | null, ApplicationError[]>;

export class ReadClientQuery implements IQuery<ReadClientQueryResult> {
    __returnType: ReadClientQueryResult = null!;

    constructor({ id }: { id: string; }) {
        this.id = id;
    }

    public id: string;
}

export default class ReadClientQueryHandler implements IRequestHandler<ReadClientQuery, ReadClientQueryResult> {
    constructor(private readonly unitOfWork: IUnitOfWork, private readonly clientDomainService: IClientDomainService) {}

    async handle(Query: ReadClientQuery): Promise<ReadClientQueryResult> {
        try {
            // Client Exists
            const clientExists = await this.clientDomainService.tryGetById(Query.id);
            if (clientExists.isErr()) return ok(null);

            const client = clientExists.value;

            return ok(client);
        } finally {
            await this.unitOfWork.rollbackTransaction();
        }
    }
}
