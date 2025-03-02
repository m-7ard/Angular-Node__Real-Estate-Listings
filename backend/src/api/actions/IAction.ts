import IApiError from "api/errors/IApiError";
import { Request, Response } from "express";

export interface IActionResponse {
    handle(res: Response): void;
}

export type TValidateResult = { ok: boolean; errors: IApiError[] };

interface IAction<ActionReq, ActionRes = IActionResponse> {
    handle(request: ActionReq): Promise<ActionRes>;
    bind(request: Request): ActionReq;
}

export default IAction;
