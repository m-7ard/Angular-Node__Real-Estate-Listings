import { createMockTeamRepository } from "__mocks__/repositories.mock";
import ListTeamsQueryHandler, { ListTeamsQuery } from "application/handlers/teams/ListTeamsQueryHandler";
import ITeamRepository from "application/interfaces/ITeamRepository";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import FilterAllTeamsCriteria from "infrastructure/contracts/FilterAllTeamsCriteria";

let mockTeamRepository: jest.Mocked<ITeamRepository>;
let handler: ListTeamsQueryHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(async () => {
    mockTeamRepository = createMockTeamRepository();
    handler = new ListTeamsQueryHandler({ teamRepository: mockTeamRepository });
});

describe("ListTeamsQueryHandler Unit Test;", () => {
    it("List Teams; Valid Data; Success;", async () => {
        // Setup
        const teamMembershipPlayerId = "teamMembershipPlayerId";
        const command = new ListTeamsQuery({ limitBy: 24, name: "name", teamMembershipPlayerId: "teamMembershipPlayerId" });
        mockTeamRepository.filterAllAsync.mockImplementationOnce(async () => []);

        // Act
        const result = await handler.handle(command);

        // Assert
        expect(result.isOk());
        expect(
            mockTeamRepository.filterAllAsync.mock.calls[0][0].equals(
                new FilterAllTeamsCriteria({ name: command.name, limitBy: command.limitBy, teamMembershipPlayerId: PlayerId.executeCreate(teamMembershipPlayerId) }),
            ),
        );
    });
});
