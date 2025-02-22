import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import supertest from "supertest";
import { disposeIntegrationTest, resetIntegrationTest, server, setUpIntegrationTest } from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import Player from "domain/entities/Player";
import IDeletePlayerRequestDTO from "api/DTOs/players/delete/IDeletePlayerRequestDTO";
import IReadPlayerRequestDTO from "api/DTOs/players/read/IReadPlayerRequestDTO";
import IReadPlayerResponseDTO from "api/DTOs/players/read/IReadPlayerResponseDTO";

let player_001: Player;

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
});

describe("Read Player Integration Test;", () => {
    it("Read Player; Valid Data; Success;", async () => {
        const request: IReadPlayerRequestDTO = {};

        const response = await supertest(server).get(`/api/players/${player_001.id}`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(200);
        const body: IReadPlayerResponseDTO = response.body;

        expect(body.player == null).toBe(false);
    });

    it("Read Player; Player does not exist; Failure;", async () => {
        const request: IReadPlayerRequestDTO = {};

        const response = await supertest(server).get(`/api/players/${"100"}`).send(request).set("Content-Type", "application/json");

        expect(response.status).toBe(404);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });
});
