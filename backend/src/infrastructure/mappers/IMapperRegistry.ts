import IClientMapper from "./interfaces/IClientMapper";
import IUserMapper from "./interfaces/IUserMapper";

interface IMapperRegistry {
    clientMapper: IClientMapper;
    userMapper: IUserMapper;
}

export default IMapperRegistry;
