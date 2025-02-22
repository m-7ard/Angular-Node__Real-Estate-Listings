import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import supertest from "supertest";
import {
    db,
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import IUpdatePlayerRequestDTO from "api/DTOs/players/update/IUpdatePlayerRequestDTO";
import Mixins from "__utils__/integrationTests/Mixins";
import Player from "domain/entities/Player";
import IPlayerSchema from "infrastructure/dbSchemas/IPlayerSchema";
import { adminSuperTest } from "__utils__/integrationTests/authSupertest";

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

describe("Update Player Integration Test;", () => {
    it("Update Player; Valid Data; Success;", async () => {
        const oldDate = player_001.activeSince;
        const request: IUpdatePlayerRequestDTO = {
            name: "updated_name",
            activeSince: new Date(Date.now() + 10000),
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .put(`/api/players/${player_001.id}/update`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        const [row] = await db.queryRows<IPlayerSchema | null>({
            statement: `SELECT * FROM player WHERE id = ${player_001.id}`,
        });
        expect(row).not.toBeNull();
        expect(row!.active_since >= oldDate).toBe(true);
        expect(row!.name).toBe(request.name);
    });

    // TODO make a theory like thing here
    it("Update Player; Validation Failure; Failure;", async () => {
        const request: IUpdatePlayerRequestDTO = {
            name: "",
            activeSince: new Date(),
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .put(`/api/players/${player_001.id}/update`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.VALIDATION_ERROR);
    });
});
