import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import supertest from "supertest";
import { disposeIntegrationTest, resetIntegrationTest, server, setUpIntegrationTest } from "../../../__utils__/integrationTests/integrationTest.setup";
import Team from "domain/entities/Team";
import Mixins from "__utils__/integrationTests/Mixins";
import IReadTeamResponseDTO from "api/DTOs/teams/read/IReadTeamResponseDTO";
import IReadTeamRequestDTO from "api/DTOs/teams/read/IReadTeamRequestDTO";
import Player from "domain/entities/Player";
import TeamMembership from "domain/entities/TeamMembership";

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

describe("Read Team Integration Test;", () => {
    it("Read Team; Valid Data; Success;", async () => {
        const request: IReadTeamRequestDTO = {};

        const response = await supertest(server).get(`/api/teams/${team_001.id}`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IReadTeamResponseDTO = response.body;
        expect(body.team.id).toEqual(team_001.id.value);
        expect(body.teamPlayers.length).toEqual(2);
    });

    it("Read Team; Team does not exist; Failure;", async () => {
        const request: IReadTeamRequestDTO = {};

        const response = await supertest(server).get(`/api/teams/${"100"}`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(404);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });
});
