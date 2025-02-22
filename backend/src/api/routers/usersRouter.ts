import { Request, Response, Router } from "express";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import RegisterUserAction from "api/actions/users/RegisterUserAction";
import LoginUserAction from "api/actions/users/LoginUserAction";
import ExpressHttpService from "api/services/ExpressHttpService";
import CurrentUserAction from "api/actions/users/CurrentUserAction";

const usersRouter = Router();

registerAction({
    router: usersRouter,
    path: "/register",
    method: "POST",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new RegisterUserAction(requestDispatcher);
    },
});

registerAction({
    router: usersRouter,
    path: "/login",
    method: "POST",
    initialiseAction: (req: Request, res: Response) => {
        const httpService = new ExpressHttpService(req, res);
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new LoginUserAction(requestDispatcher, httpService);
    },
});

registerAction({
    router: usersRouter,
    path: "/current",
    method: "GET",
    initialiseAction: (req: Request, res: Response) => {
        const httpService = new ExpressHttpService(req, res);
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new CurrentUserAction(requestDispatcher, httpService);
    },
});

export default usersRouter;
