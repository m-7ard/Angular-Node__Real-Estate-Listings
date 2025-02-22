import { NextFunction, Request, Response } from "express";

function requestBinder<Input, Output>(
    actionFn: (data: Input) => Output,
    bindFn: (req: Request, res: Response, next: NextFunction) => Input,
    responseFn: (data: Output, res: Response) => void
) {
    return (req: Request, res: Response, next: NextFunction) => {
        const input = bindFn(req, res, next);
        const output = actionFn(input);
        responseFn(output, res);
    };
}

export default requestBinder;
