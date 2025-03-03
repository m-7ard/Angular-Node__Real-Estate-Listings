import User from "domain/entities/User";
import Email from "domain/valueObjects/Common/Email";
import UserId from "domain/valueObjects/Users/UserId";

interface IUserRepository {
    createAsync: (user: User) => Promise<void>;
    getByEmailAsync: (email: Email) => Promise<User | null>;
    getByIdAsync: (id: UserId) => Promise<User | null>;
}

export default IUserRepository;
