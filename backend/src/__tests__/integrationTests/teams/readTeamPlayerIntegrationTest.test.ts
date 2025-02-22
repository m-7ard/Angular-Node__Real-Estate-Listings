import supertest from "supertest";
import { disposeIntegrationTest, resetIntegrationTest, server, setUpIntegrationTest } from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import Team from "domain/entities/Team";
import Player from "domain/entities/Player";
import TeamMembership from "domain/entities/TeamMembership";
import IReadTeamPlayerRequestDTO from "api/DTOs/teams/read-team-player/IReadTeamPlayerRequestDTO";
import IReadTeamPlayerResponseDTO from "api/DTOs/teams/read-team-player/IReadTeamPlayerResponseDTO";

let team_001: Team;
let player_001: Player;
let teamMembership_001: TeamMembership;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    const mixins = new Mixins();
    team_001 = await mixins.createTeam(1);
    player_001 = await mixins.createPlayer(1);
    teamMembership_001 = await mixins.createTeamMembership(player_001, team_001, null);
});

describe("Read Team Player Integration Test;", () => {
    it("Read Team Player; No Args; Success;", async () => {
        const request: IReadTeamPlayerRequestDTO = {};

        const response = await supertest(server).get(`/api/teams/${team_001.id}/memberships/${teamMembership_001.id}`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IReadTeamPlayerResponseDTO = response.body;
        expect(body.team.id).toEqual(team_001.id.value);
        expect(body.teamPlayer.player.id).toEqual(player_001.id.value);
        expect(body.teamPlayer.membership.id).toEqual(teamMembership_001.id.value);
    });
});
