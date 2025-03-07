import IClientRepository from "./IClientRepository";
import IRealEstateListingRepository from "./IRealEstateListingRepository";
import IUserRepository from "./IUserRepository";

interface IUnitOfWork {
    clientRepo: IClientRepository;
    realEstateListingRepo: IRealEstateListingRepository;
    userRepo: IUserRepository;
    beginTransaction: () => Promise<void>;
    commitTransaction: () => Promise<void>;
    rollbackTransaction: () => Promise<void>;
}

export default IUnitOfWork;
