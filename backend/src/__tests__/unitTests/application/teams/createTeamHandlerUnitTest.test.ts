import { createMockTeamRepository } from "__mocks__/repositories.mock";
import Mixins from "__utils__/unitTests/Mixins";
import CreateTeamCommandHandler, { CreateTeamCommand } from "application/handlers/teams/CreateTeamCommandHandler";
import ITeamRepository from "application/interfaces/ITeamRepository";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";

let player_001: Player;
let team_001: Team;
let mockTeamRepository: ITeamRepository;
let handler: CreateTeamCommandHandler;


beforeAll(() => {});

afterAll(() => {});

beforeEach(async () => {
    player_001 = Mixins.createNewPlayer(1);
    team_001 = Mixins.createNewTeam(1);
    mockTeamRepository = createMockTeamRepository();
    handler = new CreateTeamCommandHandler({ teamRepository: mockTeamRepository });
});

describe("CreateTeamCommandHandler Unit Test;", () => {
    it("Create Team; Valid Data; Success;", async () => {
        const command = new CreateTeamCommand({ dateFounded: new Date(), id: crypto.randomUUID(), name: "Team 1" });
        const result = await handler.handle(command);
        expect(result.isOk());
    });
});
