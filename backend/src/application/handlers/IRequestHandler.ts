import IRequest from "./IRequest";

export interface IRequestHandler<TCommand extends IRequest<TResult>, TResult> {
    handle(command: TCommand): Promise<TResult>;
}