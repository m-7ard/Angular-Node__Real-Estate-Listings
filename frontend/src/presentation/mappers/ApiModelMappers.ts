import { RealEstateListingAPIModel } from '../contracts/realEstateListings/list/ListRealEstateListingsResponseDTO';
import { UserAPIModel } from '../contracts/users/currentUser/CurrentUserResponseDTO';
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

    public static realEstateListingApiModelToDomain(listing: RealEstateListingAPIModel): RealEstateListing {
        console.log(listing.dateCreated);
        
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
        });
    }
}
