/* eslint-disable @typescript-eslint/no-explicit-any */
import IRequest from "./IRequest";
import IRequestDispatcher from "./IRequestDispatcher";
import { IRequestHandler } from "./IRequestHandler";

export default class RequestDispatcher implements IRequestDispatcher {
    private handlers: Map<string, () => IRequestHandler<any, any>> = new Map();

    registerHandler<TCommand extends IRequest<TResult>, TResult>(
        commandType: new (...args: any[]) => TCommand,
        factory: () => IRequestHandler<TCommand, TResult>,
    ) {
        this.handlers.set(commandType.name, factory);
    }

    dispatch<TCommand extends IRequest<TResult>, TResult>(command: TCommand): Promise<TCommand["__returnType"]> {
        const factory = this.handlers.get(command.constructor.name);

        if (!factory) {
            const error = new Error(`No handler registered for ${command.constructor.name}`);
            console.error(error);
            throw error;
        }

        const handler = factory();
        return handler.handle(command);
    }
}
