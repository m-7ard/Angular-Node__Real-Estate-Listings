import mysql from "mysql2/promise";
import IDatabaseService, { TResultHeader } from "../../api/interfaces/IDatabaseService";
import IDatabaseConnection from "api/interfaces/IDatabaseConnection";
import MySQLDatabaseConnection from "./MySQLDatabaseConnection";

class MySQLDatabaseService implements IDatabaseService {
    private pool: mysql.Pool;
    private readonly config: mysql.PoolOptions;
    private readonly name: string;

    constructor(config: mysql.PoolOptions, name: string) {
        this.pool = mysql.createPool(config);
        this.config = config;
        this.name = name;
    }

    async getConnection(): Promise<IDatabaseConnection> {
        return new MySQLDatabaseConnection(await this.pool.getConnection());
    }

    async initialise(migrations: string[]): Promise<void> {
        await this.pool.query(`DROP DATABASE IF EXISTS ${this.name}`);
        await this.pool.query(`CREATE DATABASE ${this.name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);

        this.pool.end();
        this.pool = mysql.createPool({ ...this.config, database: this.name });

        for (const migration of migrations) {
            await this.pool.query(migration);
        }
    }

    async dispose(): Promise<void> {
        await this.pool.query(`DROP DATABASE IF EXISTS ${this.name}`);
    }

    async queryRows<T>(args: { statement: string }): Promise<T[]> {
        const { statement } = args;
        const [query] = await this.pool.query<T[] & mysql.RowDataPacket[]>(statement);
        return query;
    }

    async queryHeaders(args: { statement: string }): Promise<TResultHeader> {
        const { statement } = args;
        const [query] = await this.pool.query<TResultHeader & mysql.RowDataPacket[]>(statement);
        return { affectedRows: query.affectedRows };
    }

    async executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]> {
        const { statement, parameters } = args;
        const [query] = await this.pool.execute<T[] & mysql.RowDataPacket[]>(statement, parameters);
        return query;
    }

    async executeHeaders(args: { statement: string; parameters: Array<unknown> }): Promise<TResultHeader> {
        const { statement, parameters } = args;
        const [query] = await this.pool.execute<mysql.ResultSetHeader & mysql.RowDataPacket[]>(statement, parameters);
        return { affectedRows: query.affectedRows };
    }
}

export default MySQLDatabaseService;
