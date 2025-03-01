export type TResultHeader = { affectedRows: number; }

interface IDatabaseConnection {
    startTransaction: () => Promise<void>;
    commitTransaction: () => Promise<void>;
    rollbackTransaction: () => Promise<void>;
    queryRows<T>(args: { statement: string }): Promise<T[]>;
    queryHeaders(args: { statement: string }): Promise<TResultHeader>;
    executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]>;
    executeHeaders<T>(args: { statement: string; parameters: Array<unknown> }): Promise<TResultHeader>;
    dispose: () => Promise<void>;
}

export default IDatabaseConnection;
