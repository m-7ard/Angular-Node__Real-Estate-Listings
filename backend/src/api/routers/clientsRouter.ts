import { Request, Response, Router } from "express";
import registerAction from "../utils/registerAction";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";
import CreateClientAction from "api/actions/clients/CreateClientAction";

const clientsRouter = Router();

registerAction({
    router: clientsRouter,
    path: "/create",
    method: "POST",
    initialiseAction: () => {
        const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
        return new CreateClientAction(requestDispatcher);
    },
});

export default clientsRouter;
