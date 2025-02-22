import { Request, Response } from "express";

export interface IActionResponse {
    handle(res: Response): void;
}

interface IAction<ActionReq, ActionRes = IActionResponse> {
    handle(request: ActionReq): Promise<ActionRes>;
    bind(request: Request, response: Response): ActionReq;
}

export default IAction;
