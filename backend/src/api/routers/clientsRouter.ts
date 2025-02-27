import { Request, Response, Router } from "express";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import RegisterUserAction from "api/actions/users/RegisterUserAction";

const clientsRouter = Router();

registerAction({
    router: clientsRouter,
    path: "/register",
    method: "POST",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new CreateUser(requestDispatcher);
    },
});

export default clientsRouter;
