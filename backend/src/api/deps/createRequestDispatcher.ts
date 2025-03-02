import RequestDispatcher from "application/handlers/RequestDispatcher";
import diContainer, { DI_TOKENS } from "../services/DIContainer";
import CreateClientCommandHandler, { CreateClientCommand } from "application/handlers/clients/CreateClientCommandHandler";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import RegisterUserCommandHandler, { RegisterUserCommand } from "application/handlers/users/RegisterUserCommandHandler";

function registerClientHandlers(requestDispatcher: IRequestDispatcher) {
    requestDispatcher.registerHandler(CreateClientCommand, () => {
        const clientDomainService = diContainer.resolve(DI_TOKENS.CLIENT_DOMAIN_SERVICE);
        const unitOfWork = diContainer.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new CreateClientCommandHandler(unitOfWork, clientDomainService);
    });
}

function registerUserHandlers(requestDispatcher: IRequestDispatcher) {
    requestDispatcher.registerHandler(RegisterUserCommand, () => {
        const userDomainService = diContainer.resolve(DI_TOKENS.USER_DOMAIN_SERVICE);
        const unitOfWork = diContainer.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new RegisterUserCommandHandler(unitOfWork, userDomainService);
    });
}

function createRequestDispatcher() {
    const requestDispatcher = new RequestDispatcher();

    registerClientHandlers(requestDispatcher);
    registerUserHandlers(requestDispatcher);

    return requestDispatcher;
}

export default createRequestDispatcher;
