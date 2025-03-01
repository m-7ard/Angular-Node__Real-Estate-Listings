import User from "domain/entities/User";
import DomainError from "domain/errors/DomainError";
import { Result } from "neverthrow";

export interface CreateAdminUserContract {
    id: string;
    name: string;
    email: string;
    hashedPassword: string;
}


export default interface IUserDomainService {
    canCreateAdmin(contract: CreateAdminUserContract): Result<boolean, DomainError>;
    executeCreateAdmin(contract: CreateAdminUserContract): Promise<User>;
}