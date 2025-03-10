import { DI_TOKENS } from "api/services/DIContainer";
import IPasswordHasher from "application/interfaces/IPasswordHasher";
import IUserRepository from "application/interfaces/persistence/IUserRepository";
import User from "domain/entities/User";
import { testingDIContainer } from "./integrationTest.setup";
import Client from "domain/entities/Client";
import ClientType from "domain/valueObjects/Client/ClientType";
import IClientRepository from "application/interfaces/persistence/IClientRepository";
import RealEstateListing from "domain/entities/RealEstateListing";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";
import IRealEstateListingRepository from "application/interfaces/persistence/IRealEstateListingRepository";

class Mixins {
    private readonly userRepository: IUserRepository;
    private readonly passwordHasher: IPasswordHasher;
    private readonly clientRepository: IClientRepository;
    private readonly realEstateListingRepository: IRealEstateListingRepository;

    constructor() {
        this.userRepository = testingDIContainer.testResolve(DI_TOKENS.USER_REPOSITORY);
        this.passwordHasher = testingDIContainer.testResolve(DI_TOKENS.PASSWORD_HASHER);
        this.clientRepository = testingDIContainer.testResolve(DI_TOKENS.CLIENT_REPOSITORY);
        this.realEstateListingRepository = testingDIContainer.testResolve(DI_TOKENS.REAL_ESTATE_LISTING_REPOSITORY);
    }

    async createClientUser(seed: number) {
        const password = `hashed_password_${seed}`;
        const user = User.executeCreate({
            id: `client_user_id_${seed}`,
            name: `user_${seed}`,
            email: `user_${seed}@email.com`,
            hashedPassword: await this.passwordHasher.hashPassword(password),
            isAdmin: false,
            dateCreated: new Date(),
        });

        await this.userRepository.createAsync(user);
        return { user, password };
    }

    async createAdminUser(seed: number) {
        const password = `hashed_password_${seed}`;
        const user = User.executeCreate({
            id: `admin_user_id_${seed}`,
            name: `user_${seed}`,
            email: `user_${seed}@email.com`,
            hashedPassword: await this.passwordHasher.hashPassword(password),
            isAdmin: true,
            dateCreated: new Date(),
        });

        await this.userRepository.createAsync(user);
        return { user, password };
    }

    async createPrivateClient(seed: number) {
        const client = Client.executeCreate({ id: `client_id_${seed}`, name: `client_${seed}`, type: ClientType.PRIVATE.value });

        await this.clientRepository.createAsync(client);
        return client;
    }

    async createHouseRealEstateListing(seed: number, client: Client) {
        const listing = RealEstateListing.executeCreate({
            city: `city_${seed}`,
            clientId: client.id,
            country: `country_${seed}`,
            dateCreated: new Date(),
            id: `listing_id_${seed}`,
            price: seed,
            state: `state_${seed}`,
            street: `street_${seed}`,
            type: RealEstateListingType.HOUSE.value,
            zip: `zip_${seed}`,
        });

        await this.realEstateListingRepository.createAsync(listing);
        return listing;
    }
}

export default Mixins;
