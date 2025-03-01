import User from "domain/entities/User"
import UserDbEntity from "infrastructure/dbEntities/UserDbEntity"

interface IUserMapper {
    schemaToDbEntity(source: object): UserDbEntity;
    domainToDbEntity(source: User): UserDbEntity;
    dbEntityToDomain(source: UserDbEntity): User;
}

export default IUserMapper;