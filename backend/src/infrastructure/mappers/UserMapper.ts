import User from "domain/entities/User";
import UserDbEntity from "infrastructure/dbEntities/UserDbEntity";
import IUserSchema from "infrastructure/dbSchemas/IUserSchema";

class UserMapper {
    static schemaToDbEntity(source: IUserSchema): UserDbEntity {
        return new UserDbEntity({
            id: source.id,
            name: source.name,
            email: source.email,
            hashed_password: source.hashed_password,
            date_created: source.date_created,
            is_admin: source.is_admin
        });
    }

    static domainToDbEntity(source: User): UserDbEntity {
        return new UserDbEntity({
            id: source.id,
            name: source.name,
            email: source.email,
            hashed_password: source.hashedPassword,
            date_created: source.dateCreated,
            is_admin: source.isAdmin ? 1 : 0
        });
    }

    static dbEntityToDomain(source: UserDbEntity): User {
        return new User({
            id: source.id,
            name: source.name,
            email: source.email,
            hashedPassword: source.hashed_password,
            dateCreated: source.date_created,
            isAdmin: Boolean(source.is_admin)
        });
    }
}

export default UserMapper;
