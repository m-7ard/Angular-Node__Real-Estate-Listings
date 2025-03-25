import { Router } from "express";
import registerAction from "../utils/registerAction";
import { DI_TOKENS, IDIContainer } from "api/services/DIContainer";
import CreateClientAction from "api/actions/clients/CreateClientAction";
import UpdateClientAction from "api/actions/clients/UpdateClientAction";
import ListClientsAction from "api/actions/clients/FilterClientAction";
import DeleteClientAction from "api/actions/clients/DeleteClientAction";
import ReadClientAction from "api/actions/clients/ReadClientAction";
import DeleteManyClientsAction from "api/actions/clients/DeleteManyClientsAction";

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

    registerAction({
        router: clientsRouter,
        path: "/:id/update",
        method: "PUT",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new UpdateClientAction(requestDispatcher);
        },
    });

    registerAction({
        router: clientsRouter,
        path: "/:id/delete",
        method: "DELETE",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new DeleteClientAction(requestDispatcher);
        },
    });

    registerAction({
        router: clientsRouter,
        path: "/delete",
        method: "DELETE",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new DeleteManyClientsAction(requestDispatcher);
        },
    });

    registerAction({
        router: clientsRouter,
        path: "/:id/",
        method: "GET",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new ReadClientAction(requestDispatcher);
        },
    });

    registerAction({
        router: clientsRouter,
        path: "/",
        method: "GET",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER);
            return new ListClientsAction(requestDispatcher);
        },
    });

    return clientsRouter;
}
