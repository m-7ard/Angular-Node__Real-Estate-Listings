import RequestDispatcher from "application/handlers/RequestDispatcher";
import { DI_TOKENS, IDIContainer } from "../services/DIContainer";
import CreateClientCommandHandler, { CreateClientCommand } from "application/handlers/clients/CreateClientCommandHandler";
import IRequestDispatcher from "application/handlers/IRequestDispatcher";
import RegisterUserCommandHandler, { RegisterUserCommand } from "application/handlers/users/RegisterUserCommandHandler";
import LoginUserQueryHandler, { LoginUserQuery } from "application/handlers/users/LoginUserQueryHandler";
import CurrentUserQueryHandler, { CurrentUserQuery } from "application/handlers/users/CurrentUserQueryHandler";
import DeleteManyClientsCommandHandler, { DeleteManyClientsCommand } from "application/handlers/clients/DeleteManyClientsCommandHandler";
import FilterClientsQueryHandler, { FilterClientsQuery } from "application/handlers/clients/FilterClientsQueryHandler";
import ReadClientQueryHandler, { ReadClientQuery } from "application/handlers/clients/ReadClientQueryHandler";
import UpdateClientCommandHandler, { UpdateClientCommand } from "application/handlers/clients/UpdateClientCommandHandler";
import CreateRealEstateListingCommandHandler, { CreateRealEstateListingCommand } from "application/handlers/realEstateListings/CreateRealEstateListingCommandHandler";
import UpdateRealEstateListingCommandHandler, { UpdateRealEstateListingCommand } from "application/handlers/realEstateListings/UpdateRealEstateListingCommandHandler";
import DeleteManyRealEstateListingsCommandHandler, { DeleteManyRealEstateListingsCommand } from "application/handlers/realEstateListings/DeleteManyRealEstateListingsCommandHandler";
import ReadRealEstateListingQueryHandler, { ReadRealEstateListingQuery } from "application/handlers/realEstateListings/ReadRealEstateListingQueryHandler";
import FilterRealEstateListingsQueryHandler, { FilterRealEstateListingsQuery } from "application/handlers/realEstateListings/FilterRealEstateListingsQueryHandler";

function registerClientHandlers(requestDispatcher: IRequestDispatcher, diContainer: IDIContainer) {
    // Create
    requestDispatcher.registerHandler(CreateClientCommand, () => {
        const clientDomainService = diContainer.resolve(DI_TOKENS.CLIENT_DOMAIN_SERVICE);
        const unitOfWork = diContainer.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new CreateClientCommandHandler(unitOfWork, clientDomainService);
    });

    // Update
    requestDispatcher.registerHandler(UpdateClientCommand, () => {
        const clientDomainService = diContainer.resolve(DI_TOKENS.CLIENT_DOMAIN_SERVICE);
        const unitOfWork = diContainer.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new UpdateClientCommandHandler(unitOfWork, clientDomainService);
    });

    // Delete
    requestDispatcher.registerHandler(DeleteManyClientsCommand, () => {
        const clientDomainService = diContainer.resolve(DI_TOKENS.CLIENT_DOMAIN_SERVICE);
        const realEstateListingDomainService = diContainer.resolve(DI_TOKENS.REAL_ESTATE_LISTING_DOMAIN_SERVICE);
        const unitOfWork = diContainer.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new DeleteManyClientsCommandHandler(unitOfWork, clientDomainService);
    });

    // Read
    requestDispatcher.registerHandler(ReadClientQuery, () => {
        const clientDomainService = diContainer.resolve(DI_TOKENS.CLIENT_DOMAIN_SERVICE);
        return new ReadClientQueryHandler(clientDomainService);
    });

    // Filter
    requestDispatcher.registerHandler(FilterClientsQuery, () => {
        const clientRepo = diContainer.resolve(DI_TOKENS.CLIENT_REPOSITORY);
        return new FilterClientsQueryHandler(clientRepo);
    });
}

function registerRealEstateListingHandlers(requestDispatcher: IRequestDispatcher, diContainer: IDIContainer) {
    // Create
    requestDispatcher.registerHandler(CreateRealEstateListingCommand, () => {
        const realEstateListingDomainService = diContainer.resolve(DI_TOKENS.REAL_ESTATE_LISTING_DOMAIN_SERVICE);
        const clientDomainService = diContainer.resolve(DI_TOKENS.CLIENT_DOMAIN_SERVICE);
        const unitOfWork = diContainer.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new CreateRealEstateListingCommandHandler(unitOfWork, realEstateListingDomainService, clientDomainService);
    });

    // Update
    requestDispatcher.registerHandler(UpdateRealEstateListingCommand, () => {
        const clientDomainService = diContainer.resolve(DI_TOKENS.CLIENT_DOMAIN_SERVICE);
        const realEstateListingDomainService = diContainer.resolve(DI_TOKENS.REAL_ESTATE_LISTING_DOMAIN_SERVICE);
        const unitOfWork = diContainer.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new UpdateRealEstateListingCommandHandler(unitOfWork, realEstateListingDomainService, clientDomainService);
    });

    // Delete
    requestDispatcher.registerHandler(DeleteManyRealEstateListingsCommand, () => {
        const realEstateListingDomainService = diContainer.resolve(DI_TOKENS.REAL_ESTATE_LISTING_DOMAIN_SERVICE);
        const unitOfWork = diContainer.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new DeleteManyRealEstateListingsCommandHandler(unitOfWork, realEstateListingDomainService);
    });

    // Read
    requestDispatcher.registerHandler(ReadRealEstateListingQuery, () => {
        const realEstateListingDomainService = diContainer.resolve(DI_TOKENS.REAL_ESTATE_LISTING_DOMAIN_SERVICE);
        return new ReadRealEstateListingQueryHandler(realEstateListingDomainService);
    });

    // Filter
    requestDispatcher.registerHandler(FilterRealEstateListingsQuery, () => {
        const realEstateListingRepo = diContainer.resolve(DI_TOKENS.REAL_ESTATE_LISTING_REPOSITORY);
        return new FilterRealEstateListingsQueryHandler(realEstateListingRepo);
    });
}

function registerUserHandlers(requestDispatcher: IRequestDispatcher, diContainer: IDIContainer) {
    requestDispatcher.registerHandler(RegisterUserCommand, () => {
        const userDomainService = diContainer.resolve(DI_TOKENS.USER_DOMAIN_SERVICE);
        const unitOfWork = diContainer.resolve(DI_TOKENS.UNIT_OF_WORK);
        return new RegisterUserCommandHandler(unitOfWork, userDomainService);
    });

    requestDispatcher.registerHandler(LoginUserQuery, () => {
        const userDomainService = diContainer.resolve(DI_TOKENS.USER_DOMAIN_SERVICE);
        const tokenService = diContainer.resolve(DI_TOKENS.JWT_TOKEN_SERVICE);
        const passwordHasher = diContainer.resolve(DI_TOKENS.PASSWORD_HASHER);
        return new LoginUserQueryHandler(tokenService, passwordHasher, userDomainService);
    });

    requestDispatcher.registerHandler(CurrentUserQuery, () => {
        const userDomainService = diContainer.resolve(DI_TOKENS.USER_DOMAIN_SERVICE);
        const tokenService = diContainer.resolve(DI_TOKENS.JWT_TOKEN_SERVICE);
        return new CurrentUserQueryHandler(userDomainService, tokenService);
    });
}

function createRequestDispatcher(diContainer: IDIContainer) {
    const requestDispatcher = new RequestDispatcher();

    registerClientHandlers(requestDispatcher, diContainer);
    registerUserHandlers(requestDispatcher, diContainer);
    registerRealEstateListingHandlers(requestDispatcher, diContainer);

    return requestDispatcher;
}

export default createRequestDispatcher;
