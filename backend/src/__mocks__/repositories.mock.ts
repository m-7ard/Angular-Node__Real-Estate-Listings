import IMatchRepository from "application/interfaces/IMatchRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";

export function createMockTeamRepository(): jest.Mocked<ITeamRepository> {
    return {
        createAsync: jest.fn(),
        updateAsync: jest.fn(),
        getByIdAsync: jest.fn(),
        deleteAsync: jest.fn(),
        filterAllAsync: jest.fn(),
    }
}

export function createMockMatchRepository(): jest.Mocked<IMatchRepository> {
    return {
        createAsync: jest.fn(),
        deleteAsync: jest.fn(),
        updateAsync: jest.fn(),
        getByIdAsync: jest.fn(),
        filterAllAsync: jest.fn(),
    }
}