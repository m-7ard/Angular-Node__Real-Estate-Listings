import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import ApplicationError from "application/errors/ApplicationError";
import ClientDoesNotExistError from "application/errors/application/clients/ClientDoesNotExistError";
import CannotUpdateClient from "application/errors/services/clientDomainService/CannotUpdateClient";

export type UpdateClientCommandResult = ICommandResult<ApplicationError[]>;

export class UpdateClientCommand implements ICommand<UpdateClientCommandResult> {
    __returnType: UpdateClientCommandResult = null!;

    constructor({ id, name, type }: { id: string; name: string; type: string }) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    public id: string;
    public name: string;
    public type: string;
}

export default class UpdateClientCommandHandler implements IRequestHandler<UpdateClientCommand, UpdateClientCommandResult> {
    constructor(private readonly unitOfWork: IUnitOfWork, private readonly clientDomainService: IClientDomainService) {}

    async handle(command: UpdateClientCommand): Promise<UpdateClientCommandResult> {
        try {
            // Client Exists
            const clientExists = await this.clientDomainService.tryGetById(command.id);
            if (clientExists.isErr()) return err(new ClientDoesNotExistError({ message: clientExists.error.message }).asList());

            const client = clientExists.value;

            // Update Client
            const createResult = await this.clientDomainService.tryOrchestractUpdateClient(client, { name: command.name, type: command.type });
            if (createResult.isErr()) return err(new CannotUpdateClient({ message: createResult.error.message }).asList());
    
            await this.unitOfWork.commitTransaction();
            
            return ok(undefined);
        } finally {
            await this.unitOfWork.rollbackTransaction();
        }
    }
}
