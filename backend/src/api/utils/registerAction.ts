import { NextFunction, Request, Response, Router } from "express";
import IAction, { IActionResponse } from "../actions/IAction";

function registerAction({
    router,
    initialiseAction,
    path,
    method,
    guards = [],
}: {
    router: Router;
    initialiseAction: (req: Request, res: Response) => IAction<unknown, IActionResponse>;
    path: string;
    method: "POST" | "GET" | "PUT" | "DELETE";
    guards?: Array<(req: Request, res: Response, next: NextFunction) => void | Promise<void>>;
}) {
    const handleRequest = async (req: Request, res: Response, next: NextFunction) => {
        const action = initialiseAction(req, res);

        const arg = action.bind(req);

        try {
            const result = await action.handle(arg);
            result.handle(res);
        } catch (err) {
            console.warn(err);
            next(err);
        }
    };

    if (method === "POST") {
        router.post(path, guards, handleRequest);
    } else if (method === "GET") {
        router.get(path, guards, handleRequest);
    } else if (method === "PUT") {
        router.put(path, guards, handleRequest);
    } else if (method === "DELETE") {
        router.delete(path, guards, handleRequest);
    }
}

export default registerAction;
