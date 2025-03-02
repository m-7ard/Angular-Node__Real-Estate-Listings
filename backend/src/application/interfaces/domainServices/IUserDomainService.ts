import User from "domain/entities/User";
import ApplicationError from "application/errors/ApplicationError";
import { Result } from "neverthrow";

export interface CreateAdminUserContract {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface CreateStandardUserContract {
    id: string;
    name: string;
    email: string;
    password: string;
}

export default interface IUserDomainService {
    tryCreateAdminUser(contract: CreateAdminUserContract): Promise<Result<User, ApplicationError>>;
    tryCreateStandardUser(contract: CreateStandardUserContract): Promise<Result<User, ApplicationError>>;
    tryGetUserByEmail(email: string): Promise<Result<User, ApplicationError>>;
}
