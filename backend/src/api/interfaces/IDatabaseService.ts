import IDatabaseConnection from "./IDatabaseConnection";

export type TResultHeader = { affectedRows: number; }

interface IDatabaseService {
    initialise(migrations: string[]): Promise<void>;
    dispose(): Promise<void>;
    getConnection(): Promise<IDatabaseConnection>;
    queryRows<T>(args: { statement: string }): Promise<T[]>;
    queryHeaders(args: { statement: string }): Promise<TResultHeader>;
    executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]>;
    executeHeaders<T>(args: { statement: string; parameters: Array<unknown> }): Promise<TResultHeader>;
}

export default IDatabaseService;
