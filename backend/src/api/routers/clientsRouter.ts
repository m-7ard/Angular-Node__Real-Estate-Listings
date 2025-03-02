import { Router } from "express";
import registerAction from "../utils/registerAction";
import { DI_TOKENS, IDIContainer } from "api/services/DIContainer";
import CreateClientAction from "api/actions/clients/CreateClientAction";

export function createClientsRouter(diContainer: IDIContainer) {
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

    return clientsRouter;
}
