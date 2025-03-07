import IClientMapper from "./interfaces/IClientMapper";
import IRealEstateListingMapper from "./interfaces/IRealEstateListingMapper";
import IUserMapper from "./interfaces/IUserMapper";

interface IMapperRegistry {
    clientMapper: IClientMapper;
    userMapper: IUserMapper;
    realEstateListingMapper: IRealEstateListingMapper;
}

export default IMapperRegistry;
