import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IClientRepository from "application/interfaces/persistence/IClientRepository";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import IUserRepository from "application/interfaces/persistence/IUserRepository";

export default class UnitOfWork implements IUnitOfWork {
    constructor(private readonly db: IDatabaseConnection, readonly userRepo: IUserRepository, readonly clientRepo: IClientRepository) {}
    
    async beginTransaction() {
        await this.db.startTransaction();
    };
    
    async commitTransaction() {
        await this.db.commitTransaction();
    };

    async rollbackTransaction() {
        await this.db.rollbackTransaction();
    };
}