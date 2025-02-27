import mysql from "mysql2/promise";
import { TResultHeader } from "../../api/interfaces/IDatabaseService";
import IDatabaseConnection from "api/interfaces/IDatabaseConnection";

class MySQLDatabaseConnection implements IDatabaseConnection {
    constructor(private readonly connection: mysql.Connection) {}

    async startTransaction() {
        await this.connection.beginTransaction();
    };

    async commitTransaction() {
        await this.connection.commit();
    };

    async rollbackTransaction() {
        await this.connection.rollback();
    };

    async queryRows<T>(args: { statement: string }): Promise<T[]> {
        const { statement } = args;
        const [query] = await this.connection.query<T[] & mysql.RowDataPacket[]>(statement);
        return query;
    }

    async queryHeaders(args: { statement: string }): Promise<TResultHeader> {
        const { statement } = args;
        const [query] = await this.connection.query<TResultHeader & mysql.RowDataPacket[]>(statement);
        return { affectedRows: query.affectedRows };
    }

    async executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]> {
        const { statement, parameters } = args;
        const [query] = await this.connection.execute<T[] & mysql.RowDataPacket[]>(statement, parameters);
        return query;
    }

    async executeHeaders(args: { statement: string; parameters: Array<unknown> }): Promise<TResultHeader> {
        const { statement, parameters } = args;
        const [query] = await this.connection.execute<mysql.ResultSetHeader & mysql.RowDataPacket[]>(statement, parameters);
        return { affectedRows: query.affectedRows };
    }

    async disponse() {
        await this.connection.end();
    }
}

export default MySQLDatabaseConnection;
