import IDatabaseService from "api/interfaces/IDatabaseService";
import IUserRepository from "application/interfaces/IUserRepository";
import sql from "sql-template-tag";
import User from "domain/entities/User";
import IUserSchema from "infrastructure/dbSchemas/IUserSchema";
import UserMapper from "infrastructure/mappers/UserMapper";
import UserDbEntity from "infrastructure/dbEntities/UserDbEntity";

class UserRepository implements IUserRepository {
    private readonly _db: IDatabaseService;

    constructor(db: IDatabaseService) {
        this._db = db;
    }

    async getByEmailAsync(email: string): Promise<User | null> {
        const sqlEntry = sql`SELECT * FROM users WHERE email = ${email}`;

        const [row] = await this._db.executeRows<IUserSchema | null>({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (row == null) {
            return null;
        }

        const user = UserMapper.schemaToDbEntity(row);
        return user == null ? null : UserMapper.dbEntityToDomain(user);
    }

    async createAsync(user: User): Promise<void> {
        const dbEntity = UserMapper.domainToDbEntity(user);
        const sqlEntry = dbEntity.getInsertEntry();

        await this._db.executeHeaders({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });
    }

    async updateAsync(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async getByIdAsync(id: string): Promise<User | null> {
        const sqlEntry = UserDbEntity.getByIdStatement(id);

        const [row] = await this._db.executeRows<IUserSchema | null>({
            statement: sqlEntry.sql,
            parameters: sqlEntry.values,
        });

        if (row == null) {
            return null;
        }

        const user = UserMapper.schemaToDbEntity(row);
        return user == null ? null : UserMapper.dbEntityToDomain(user);
    }

    async deleteAsync(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default UserRepository;
