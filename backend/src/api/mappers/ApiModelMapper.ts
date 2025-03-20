import User from "domain/entities/User";
import { UserAPIModel } from "../../../types/api/models/UserApiModel";
import Client from "domain/entities/Client";
import { ClientAPIModel } from "../../../types/api/models/ClientApiModel";
import RealEstateListing from "domain/entities/RealEstateListing";
import { RealEstateListingAPIModel } from "../../../types/api/models/RealEstateListingApiModel";

class ApiModelMapper {
    public static createUserApiModel(user: User): UserAPIModel {
        return {
            id: user.id.value,
            email: user.email.value,
            name: user.name,
            isAdmin: user.isAdmin,
        };
    }

    public static createClientApiModel(client: Client): ClientAPIModel {
        return {
            id: client.id.value,
            name: client.name,
            type: client.type.value,
        };
    }

    public static createRealEstateListingApiModel(listing: RealEstateListing): RealEstateListingAPIModel {
        return {
            id: listing.id.value,
            city: listing.address.city,
            clientId: listing.clientId.value,
            country: listing.address.country,
            dateCreated: listing.dateCreated,
            price: listing.price.value,
            state: listing.address.state,
            street: listing.address.street,
            type: listing.type.value,
            zip: listing.address.zip,
            squareMeters: listing.info.squareMeters,
            yearBuilt: listing.info.yearBuilt,
            bathroomNumber: listing.info.bathroomNumber,
            bedroomNumber: listing.info.bedroomNumber,
            description: listing.info.description,
            flooringType: listing.info.flooringType,
            title: listing.title,
        };
    }
}

export default ApiModelMapper;
