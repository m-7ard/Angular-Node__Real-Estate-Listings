import IClientDomainService from "application/interfaces/domainServices/IClientDomainService";
import IClientRepository from "application/interfaces/persistence/IClientRepository";
import IUnitOfWork from "application/interfaces/persistence/IUnitOfWork";
import IUserRepository from "application/interfaces/persistence/IUserRepository";

export function createClientRepositoryMock(): jest.Mocked<IClientRepository> {
    return {
        createAsync: jest.fn(),
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
    };
}


export function createClientDomainServiceMock(): jest.Mocked<IClientDomainService> {
    return {
        "tryOrchestractCreateNewClient": jest.fn()
    };
}
