import IUserRepository from "application/interfaces/IUserRepository";
import sql from "sql-template-tag";
import User from "domain/entities/User";
import UserDbEntity from "infrastructure/dbEntities/UserDbEntity";
import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import IMapperRegistry from "infrastructure/mappers/IMapperRegistry";

class UserRepository implements IUserRepository {
    constructor(private readonly db: IDatabaseConnection, private readonly registry: IMapperRegistry) {}

    async getByEmailAsync(email: string): Promise<User | null> {
        const sqlEntry = sql`SELECT * FROM users WHERE email = ${email}`;

        const [row] = await this.db.executeRows<object | null>({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (row == null) {
            return null;
        }

        const user = this.registry.userMapper.schemaToDbEntity(row);
        return user == null ? null : this.registry.userMapper.dbEntityToDomain(user);
    }

    async createAsync(user: User): Promise<void> {
        const dbEntity = this.registry.userMapper.domainToDbEntity(user);
        const sqlEntry = dbEntity.getInsertEntry();

        await this.db.executeHeaders({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });
    }

    async updateAsync(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getByIdAsync(id: string): Promise<User | null> {
        const sqlEntry = UserDbEntity.getByIdStatement(id);

        const [row] = await this.db.executeRows<object | null>({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (row == null) {
            return null;
        }

        const user = this.registry.userMapper.schemaToDbEntity(row);
        return user == null ? null : this.registry.userMapper.dbEntityToDomain(user);
    }

    async deleteAsync(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default UserRepository;
