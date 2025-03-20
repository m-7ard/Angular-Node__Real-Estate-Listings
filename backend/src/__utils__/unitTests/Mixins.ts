import Client from "domain/entities/Client";
import RealEstateListing from "domain/entities/RealEstateListing";
import User from "domain/entities/User";
import ClientType from "domain/valueObjects/Client/ClientType";
import RealEstateListingType from "domain/valueObjects/RealEstateListing/RealEstateListingType";

class Mixins {
    static createUser(seed: number, isAdmin: boolean) {
        const password = `hashed_password_${seed}`;
        const user = User.executeCreate({
            id: `${seed}`,
            name: `user_${seed}`,
            email: `user_${seed}@email.com`,
            hashedPassword: password,
            isAdmin: isAdmin,
            dateCreated: new Date(),
        });

        return { user, password };
    }

    static createClient(seed: number) {
        const client = Client.executeCreate({
            id: `${seed}`,
            name: `client_${seed}`,
            type: ClientType.PRIVATE.value,
        });

        return client;
    }

    static createRealEstateListing(seed: number, client: Client) {
        const listing = RealEstateListing.executeCreate({
            city: `city_${seed}`,
            clientId: client.id,
            country: `country_${seed}`,
            dateCreated: new Date(),
            id: `${seed}`,
            price: seed,
            state: `state_${seed}`,
            street: `street_${seed}`,
            type: RealEstateListingType.HOUSE.value,
            zip: `zip_${seed}`,
            squareMeters: seed,
            yearBuilt: seed,
            bathroomNumber: seed,
            bedroomNumber: seed,
            description: `description_${seed}`,
            flooringType: `flooringType_${seed}`,
            title: `title_${seed}`,
        });

        return listing;
    }
}

export default Mixins;
