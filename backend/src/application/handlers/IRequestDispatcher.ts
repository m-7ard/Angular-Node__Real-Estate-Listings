/* eslint-disable @typescript-eslint/no-explicit-any */
import IRequest from "./IRequest";
import { IRequestHandler } from "./IRequestHandler";

export default interface IRequestDispatcher {
    registerHandler<TCommand extends IRequest<TResult>, TResult>(
        commandType: new (...args: any[]) => TCommand,
        handler: IRequestHandler<TCommand, TResult>,
    ): void;

    dispatch<TResult>(command: IRequest<TResult>): Promise<TResult>;
}
