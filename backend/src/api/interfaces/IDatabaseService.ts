export type TResultHeader = { affectedRows: number; }

interface IDatabaseService {
    __type: string;
    initialise(migrations: string[]): Promise<void>;
    dispose(): Promise<void>;
    queryRows<T>(args: { statement: string }): Promise<T[]>;
    queryHeaders(args: { statement: string }): Promise<TResultHeader>;
    executeRows<T>(args: { statement: string; parameters: Array<unknown> }): Promise<T[]>;
    executeHeaders<T>(args: { statement: string; parameters: Array<unknown> }): Promise<TResultHeader>;
}

export default IDatabaseService;
