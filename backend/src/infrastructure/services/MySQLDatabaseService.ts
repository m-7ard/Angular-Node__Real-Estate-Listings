import mysql from "mysql2/promise";
import IDatabaseService, { TResultHeader } from "../../api/interfaces/IDatabaseService";

class MySQLDatabaseService implements IDatabaseService {
    private _pool: mysql.Pool;
    private readonly _config: mysql.PoolOptions;
    public readonly __type = "mysql2";

    constructor(config: mysql.PoolOptions) {
        this._pool = mysql.createPool(config);
        this._config = config;
    }

    async initialise(migrations: string[]): Promise<void> {
        await this._pool.query(`DROP DATABASE IF EXISTS football_manager`);
        await this._pool.query(`CREATE DATABASE football_manager`);

        this._pool.end();
        this._pool = mysql.createPool({ ...this._config, database: "football_manager" });

        for (const migration of migrations) {
            await this._pool.query(migration);
        }
    }

    async dispose(): Promise<void> {
        await this._pool.query(`DROP DATABASE IF EXISTS football_manager`);
    }

    async queryRows<T>(args: { statement: string }): Promise<T[]> {
        const { statement } = args;
        const [query] = await this._pool.query<T[] & mysql.RowDataPacket[]>(statement);
        return query;
    }

    async queryHeaders(args: { statement: string }): Promise<TResultHeader> {
        const { statement } = args;
        const [query] = await this._pool.query<TResultHeader & mysql.RowDataPacket[]>(statement);
        return { affectedRows: query.affectedRows };
    }

    async executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]> {
        const { statement, parameters } = args;
        const [query] = await this._pool.execute<T[] & mysql.RowDataPacket[]>(statement, parameters);
        return query;
    }

    async executeHeaders(args: { statement: string; parameters: Array<unknown> }): Promise<TResultHeader> {
        const { statement, parameters } = args;
        const [query] = await this._pool.execute<mysql.ResultSetHeader & mysql.RowDataPacket[]>(statement, parameters);
        return { affectedRows: query.affectedRows };
    }
}

export default MySQLDatabaseService;
