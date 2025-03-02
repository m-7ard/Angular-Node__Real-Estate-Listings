import UserDbEntity from "infrastructure/dbEntities/UserDbEntity";
import IMySQLUserSchema from "infrastructure/dbSchemas/MySQL/IMySQLUserSchema";
import User from "domain/entities/User";
import IUserMapper from "../interfaces/IUserMapper";

class MySQLUserMapper implements IUserMapper {
    schemaToDbEntity(source: IMySQLUserSchema): UserDbEntity {
        return new UserDbEntity({
            id: source.id,
            name: source.name,
            date_created: source.date_created,
            email: source.email,
            hashed_password: source.hashed_password,
            is_admin: source.is_admin,
        });
    }

    domainToDbEntity(source: User): UserDbEntity {
        return new UserDbEntity({
            id: source.id.value,
            name: source.name,
            date_created: source.dateCreated,
            email: source.email.value,
            hashed_password: source.hashedPassword,
            is_admin: source.isAdmin ? 1 : 0,
        });
    }

    dbEntityToDomain(source: UserDbEntity): User {
        return User.executeCreate({
            id: source.id,
            name: source.name,
            dateCreated: source.date_created,
            email: source.email,
            hashedPassword: source.hashed_password,
            isAdmin: Boolean(source.is_admin),
        });
    }
}

export default MySQLUserMapper;
