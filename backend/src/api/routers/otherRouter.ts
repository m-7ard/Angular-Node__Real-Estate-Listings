import { Router } from "express";
import registerAction from "../utils/registerAction";
import { IDIContainer } from "api/services/DIContainer";
import StaticDataAction from "api/actions/other/StaticDataAction";

export function createOtherRouter(diContainer: IDIContainer) {
    const clientsRouter = Router();

    registerAction({
        router: clientsRouter,
        path: "/static-data",
        method: "GET",
        initialiseAction: () => {
            return new StaticDataAction();
        },
    });

    return clientsRouter;
}
