import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IClientRepository from "application/interfaces/IClientRepository";
import IUnitOfWork from "application/interfaces/IUnitOfWork";
import IUserRepository from "application/interfaces/IUserRepository";

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