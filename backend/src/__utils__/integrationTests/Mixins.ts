import { DI_TOKENS } from "api/services/DIContainer";
import IPasswordHasher from "application/interfaces/IPasswordHasher";
import IUserRepository from "application/interfaces/IUserRepository";
import User from "domain/entities/User";
import { testingDIContainer } from "./integrationTest.setup";

class Mixins {
    private readonly _userRepository: IUserRepository;
    private readonly _passwordHasher: IPasswordHasher;

    constructor() {
        this._userRepository = testingDIContainer.resolve(DI_TOKENS.USER_REPOSITORY);
        this._passwordHasher = testingDIContainer.resolve(DI_TOKENS.PASSWORD_HASHER);
    }

    async createClientUser(seed: number) {
        const password = `hashed_password_${seed}`;
        const user = User.executeCreate({
            id: `${seed}`,
            name: `user_${seed}`,
            email: `user_${seed}@email.com`,
            hashedPassword: await this._passwordHasher.hashPassword(password),
            isAdmin: false,
            dateCreated: new Date()
        });

        await this._userRepository.createAsync(user);
        return { user, password };
    }

    async createAdminUser(seed: number) {
        const password = `hashed_password_${seed}`;
        const user = User.executeCreate({
            id: `${seed}`,
            name: `user_${seed}`,
            email: `user_${seed}@email.com`,
            hashedPassword: await this._passwordHasher.hashPassword(password),
            isAdmin: true,
            dateCreated: new Date()
        });

        await this._userRepository.createAsync(user);
        return { user, password };
    }
}

export default Mixins;
