import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import IRealEstateListingDomainService from "application/interfaces/domainServices/IRealEstateListingDomainService";
import IClientRepository from "application/interfaces/persistence/IClientRepository";
import IRealEstateListingRepository from "application/interfaces/persistence/IRealEstateListingRepository";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import IUserRepository from "application/interfaces/persistence/IUserRepository";

export function createClientRepositoryMock(): jest.Mocked<IClientRepository> {
    return {
        createAsync: jest.fn(),
        getByIdAsync: jest.fn(),
        updateAsync: jest.fn(),
        deleteAsync: jest.fn(),
        filterAsync: jest.fn()
    };
}

export function createRealEstateListingRepositoryMock(): jest.Mocked<IRealEstateListingRepository> {
    return {
        createAsync: jest.fn(),
        updateAsync: jest.fn(),
        getByIdAsync: jest.fn(),
        deleteAsync: jest.fn(),
        filterAsync: jest.fn()
    };
}

export function createUserRepositoryMock(): jest.Mocked<IUserRepository> {
    return {
        createAsync: jest.fn(),
        getByEmailAsync: jest.fn(),
        getByIdAsync: jest.fn(),
    };
}

export function createUnitOfWorkMock(): jest.Mocked<IUnitOfWork> {
    return {
        beginTransaction: jest.fn(),
        clientRepo: createClientRepositoryMock(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        userRepo: createUserRepositoryMock(),
        realEstateListingRepo: createRealEstateListingRepositoryMock()
    };
}


export function createClientDomainServiceMock(): jest.Mocked<IClientDomainService> {
    return {
        "tryOrchestractCreateNewClient": jest.fn(),
        "tryGetById": jest.fn(),
        "tryOrchestractUpdateClient": jest.fn()
    };
}

export function createRealEstateListingDomainServiceMock(): jest.Mocked<IRealEstateListingDomainService> {
    return {
        "tryOrchestractCreateNewListing": jest.fn(),
        "tryGetById": jest.fn(),
        "tryOrchestractUpdateListing": jest.fn()
    };
}
