import IClientRepository from "./IClientRepository";
import IUserRepository from "./IUserRepository";

interface IUnitOfWork {
    clientRepo: IClientRepository;
    userRepo: IUserRepository;
    beginTransaction: () => Promise<void>;
    commitTransaction: () => Promise<void>;
    rollbackTransaction: () => Promise<void>;
}

export default IUnitOfWork;
