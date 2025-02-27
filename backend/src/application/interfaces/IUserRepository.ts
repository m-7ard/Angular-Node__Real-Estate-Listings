import User from "domain/entities/User";

interface IUserRepository {
    createAsync: (User: User) => Promise<void>;
}

export default IUserRepository;
