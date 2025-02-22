/* eslint-disable @typescript-eslint/no-explicit-any */
import IRequest from "./IRequest";
import IRequestDispatcher from "./IRequestDispatcher";
import { IRequestHandler } from "./IRequestHandler";

export default class RequestDispatcher implements IRequestDispatcher {
    private handlers: Map<string, IRequestHandler<any, any>> = new Map();

    registerHandler<TCommand extends IRequest<TResult>, TResult>(
        commandType: new (...args: any[]) => TCommand,
        handler: IRequestHandler<TCommand, TResult>,
    ) {
        this.handlers.set(commandType.name, handler);
    }

    dispatch<TCommand extends IRequest<TResult>, TResult>(command: TCommand): Promise<TCommand["__returnType"]> {
        const handler = this.handlers.get(command.constructor.name);

        if (!handler) {
            const error = new Error(`No handler registered for ${command.constructor.name}`);
            console.error(error);
            throw error;
        }

        return handler.handle(command);
    }
}
