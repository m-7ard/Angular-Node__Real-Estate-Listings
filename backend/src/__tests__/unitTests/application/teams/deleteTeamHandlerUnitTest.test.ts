import { createMockTeamExistsValidator } from "__mocks__/repositories.applicationServices";
import { createMockMatchRepository, createMockTeamRepository } from "__mocks__/repositories.mock";
import Mixins from "__utils__/unitTests/Mixins";
import SetupMockServices from "__utils__/unitTests/SetupMockServices";
import APPLICATION_SERVICE_CODES from "application/errors/APPLICATION_SERVICE_CODES";
import ApplicationErrorFactory from "application/errors/ApplicationErrorFactory";
import DeleteTeamCommandHandler, { DeleteTeamCommand } from "application/handlers/teams/DeleteTeamCommandHandler";
import IMatchRepository from "application/interfaces/IMatchRepository";
import ITeamRepository from "application/interfaces/ITeamRepository";
import ITeamValidator from "application/interfaces/ITeamValidator";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import TeamId from "domain/valueObjects/Team/TeamId";
import { err, ok } from "neverthrow";

let player_001: Player;
let team_001: Team;
let mockTeamRepository: jest.Mocked<ITeamRepository>;
let mockMatchRepository: jest.Mocked<IMatchRepository>;
let mockTeamExistsValidator: jest.Mocked<ITeamValidator<TeamId>>;
let handler: DeleteTeamCommandHandler;

beforeAll(() => {});

afterAll(() => {});

beforeEach(async () => {
    player_001 = Mixins.createNewPlayer(1);
    team_001 = Mixins.createNewTeam(1);
    mockTeamRepository = createMockTeamRepository();
    mockMatchRepository = createMockMatchRepository();
    mockTeamExistsValidator = createMockTeamExistsValidator();
    handler = new DeleteTeamCommandHandler({ teamRepository: mockTeamRepository, matchRepository: mockMatchRepository, teamExistsValidator: mockTeamExistsValidator });
});

describe("DeleteTeamCommandHandler Unit Test;", () => {
    it("Delete Team; Valid Data; Success;", async () => {
        // Setup
        const command = new DeleteTeamCommand({ id: team_001.id.value });
        SetupMockServices.setupTeamExistsValidatorSuccess({ mockValidator: mockTeamExistsValidator, input: team_001.id, output: team_001 });
        mockMatchRepository.filterAllAsync.mockImplementationOnce(async () => []);
        
        // Act
        const result = await handler.handle(command);

        // Assert
        expect(result.isOk());
        expect(mockTeamRepository.deleteAsync).toHaveBeenCalledWith(team_001);
    });
});
