import { Router } from "express";
import registerAction from "../utils/registerAction";
import { DI_TOKENS, IDIContainer } from "api/services/DIContainer";
import StaticDataAction from "api/actions/other/StaticDataAction";
import SendEmailAction from "api/actions/other/SendEmailAction";

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

    registerAction({
        router: clientsRouter,
        path: "/send-email",
        method: "POST",
        initialiseAction: () => {
            const requestDispatcher = diContainer.resolve(DI_TOKENS.REQUEST_DISPATCHER)
            const emailService = diContainer.resolve(DI_TOKENS.EMAIL_SERVICE)
            return new SendEmailAction(requestDispatcher, emailService);
        },
    });

    return clientsRouter;
}
