import RequestDispatcher from "application/handlers/RequestDispatcher";
import diContainer, { DI_TOKENS } from "./diContainer";
import CreateClientCommandHandler, { CreateClientCommand } from "application/handlers/clients/CreateClientCommandHandler";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";

function registerClientHandlers(requestDispatcher: IRequestDispatcher) {
    requestDispatcher.registerHandler(CreateClientCommand, () => {
        const clientDomainService = diContainer.resolve(DI_TOKENS.CLIENT_DOMAIN_SERVICE);
        const unitOfWork = diContainer.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new CreateClientCommandHandler(unitOfWork, clientDomainService);
    });
}

function createRequestDispatcher() {
    const requestDispatcher = new RequestDispatcher();

    registerClientHandlers(requestDispatcher);

    return requestDispatcher;
}

export default createRequestDispatcher;
