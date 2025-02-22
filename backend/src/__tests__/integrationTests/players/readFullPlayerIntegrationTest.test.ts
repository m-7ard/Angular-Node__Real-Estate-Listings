import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import supertest from "supertest";
import {
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import IReadFullPlayerRequestDTO from "api/DTOs/players/read-full/IReadPlayerRequestDTO";
import IReadFullPlayerResponseDTO from "api/DTOs/players/read-full/IReadPlayerResponseDTO";
import { DateTime } from "luxon";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let player_001: Player;
let activeTeam: Team;
let formerTeam: Team;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();

    const mixins = new Mixins();
    player_001 = await mixins.createPlayer(1);
    activeTeam = await mixins.createTeam(1);
    formerTeam = await mixins.createTeam(2);
    await mixins.createTeamMembership(player_001, activeTeam, null);
    await mixins.createTeamMembership(player_001, formerTeam, formerTeam.dateFounded);
});

describe("Read Full Player Integration Test;", () => {
    it("Read Full Player; Valid Data; Success;", async () => {
        const request: IReadFullPlayerRequestDTO = {};

        const response = await supertest(server)
            .get(`/api/players/${player_001.id}/full`)
            .send(request)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IReadFullPlayerResponseDTO = response.body;

        expect(body.player == null).toBe(false);
        expect(body.currentTeams.length).toBe(1);
        expect(body.currentTeams[0].id).toBe(activeTeam.id.value);
        expect(body.formerTeams.length).toBe(1);
        expect(body.formerTeams[0].id).toBe(formerTeam.id.value);
    });

    it("Read Full Player; Player does not exist; Failure;", async () => {
        const request: IReadFullPlayerRequestDTO = {};

        const response = await supertest(server)
            .get(`/api/players/${"100"}/full`)
            .send(request)
            .set("Content-Type", "application/json");

        expect(response.status).toBe(404);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });
});
