import { IRequestHandler } from "../IRequestHandler";
import ICommand, { ICommandResult } from "../ICommand";
import { err, ok } from "neverthrow";
import IUnitOfWork from "application/interfaces/IUnitOfWork";
import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import CannotCreateNewClient from "application/errors/services/clientDomainService/CannotCreateNewClient";
import ApplicationError from "application/errors/ApplicationError";

export type CreateClientCommandResult = ICommandResult<ApplicationError[]>;

export class CreateClientCommand implements ICommand<CreateClientCommandResult> {
    __returnType: CreateClientCommandResult = null!;

    constructor({ id, name, type }: { id: string; name: string; type: string }) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    public id: string;
    public name: string;
    public type: string;
}

export default class CreateClientCommandHandler implements IRequestHandler<CreateClientCommand, CreateClientCommandResult> {
    constructor(private readonly unitOfWork: IUnitOfWork, private readonly clientDomainService: IClientDomainService) {}

    async handle(command: CreateClientCommand): Promise<CreateClientCommandResult> {
        try {
            const createResult = await this.clientDomainService.tryOrchestractCreateNewClient({ id: command.id, name: command.name, type: command.type });
            if (createResult.isErr()) return err(new CannotCreateNewClient({ message: createResult.error.message }).asList());
    
            await this.unitOfWork.commitTransaction();
            
            return ok(undefined);
        } finally {
            await this.unitOfWork.rollbackTransaction();
        }
    }
}
