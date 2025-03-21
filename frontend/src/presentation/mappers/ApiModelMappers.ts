import { ClientAPIModel } from '../contracts/clients/list/ListClientsResponseDTO';
import { RealEstateListingAPIModel } from '../contracts/realEstateListings/list/ListRealEstateListingsResponseDTO';
import { UserAPIModel } from '../contracts/users/currentUser/CurrentUserResponseDTO';
import Client from '../models/Client';
import RealEstateListing from '../models/RealEstateListing';
import User from '../models/User';

export default class ApiModelMappers {
    public static userApiModelToDomain(user: UserAPIModel): User {
        return new User({
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
            name: user.name,
        });
    }

    public static clientApiModelToDomain(client: ClientAPIModel): Client {
        return new Client({
            id: client.id,
            name: client.name,
            type: client.type,
        });
    }

    public static realEstateListingApiModelToDomain(listing: RealEstateListingAPIModel): RealEstateListing {
        return new RealEstateListing({
            city: listing.city,
            clientId: listing.clientId,
            country: listing.country,
            dateCreated: listing.dateCreated,
            id: listing.id,
            price: listing.price,
            state: listing.state,
            street: listing.street,
            type: listing.type,
            zip: listing.zip,
            title: listing.title,
            squareMeters: listing.squareMeters,
            yearBuilt: listing.yearBuilt,
            bathroomNumber: listing.bathroomNumber,
            bedroomNumber: listing.bedroomNumber,
            description: listing.description,
            flooringType: listing.flooringType,
            images: listing.images
        });
    }
}
