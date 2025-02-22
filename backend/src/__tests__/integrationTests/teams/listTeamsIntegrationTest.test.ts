import supertest from "supertest";
import {
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import Team from "domain/entities/Team";
import IListTeamsRequestDTO from "api/DTOs/teams/list/IListTeamsRequestDTO";
import IListTeamsResponseDTO from "api/DTOs/teams/list/IListTeamsResponseDTO";
import urlWithQuery from "__utils__/integrationTests/urlWithQuery";

let team_001: Team;
let team_002: Team;
let team_003: Team;
const BASE_URL = "/api/teams/";

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
    team_002 = await mixins.createTeam(2);
    team_003 = await mixins.createTeam(3);
});

describe("List Teams Integration Test;", () => {
    it("List Teams; No Args; Success;", async () => {
        const request: IListTeamsRequestDTO = {
            name: null,
            teamMembershipPlayerId: null,
            limitBy: null,
        };

        const url = urlWithQuery(BASE_URL, request);

        const response = await supertest(server)
            .get(url)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListTeamsResponseDTO = response.body;
        expect(body.teams).toHaveLength(3);
    });

    it("List Teams; LimitBy 5; Success;", async () => {
        const mixins = new Mixins();
        for (let i = 0; i < 10; i++) {
            await mixins.createTeam(10 + i);
        }
        const request: IListTeamsRequestDTO = {
            name: null,
            teamMembershipPlayerId: null,
            limitBy: 5,
        };

        const url = urlWithQuery(BASE_URL, request);

        const response = await supertest(server)
            .get(url)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IListTeamsResponseDTO = response.body;
        expect(body.teams).toHaveLength(5);
    });
});
