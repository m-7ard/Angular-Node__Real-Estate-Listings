import supertest from "supertest";
import { disposeIntegrationTest, resetIntegrationTest, server, setUpIntegrationTest } from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import Team from "domain/entities/Team";
import Player from "domain/entities/Player";
import TeamMembership from "domain/entities/TeamMembership";
import IListTeamPlayersRequestDTO from "api/DTOs/teams/list-team-players/IListTeamPlayersRequestDTO";
import IListTeamPlayersResponseDTO from "api/DTOs/teams/list-team-players/IListTeamPlayersResponseDTO";

let team_001: Team;
let player_001: Player;
let player_002: Player;
let teamMembership_001: TeamMembership;
let teamMembership_002: TeamMembership;

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
    player_002 = await mixins.createPlayer(2);
    teamMembership_001 = await mixins.createTeamMembership(player_001, team_001, null);
    teamMembership_002 = await mixins.createTeamMembership(player_002, team_001, null);
});

describe("List Team Players Integration Test;", () => {
    it("List Team Players; No Args; Success;", async () => {
        const request: IListTeamPlayersRequestDTO = {};

        const response = await supertest(server).get(`/api/teams/${team_001.id}/players`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListTeamPlayersResponseDTO = response.body;
        expect(body.team.id).toEqual(team_001.id.value);
        expect(body.teamPlayers.length).toEqual(2);
    });
});
