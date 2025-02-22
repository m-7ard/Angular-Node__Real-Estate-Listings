import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import {
    db,
    setUpIntegrationTest,
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
} from "__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import IScheduleMatchRequestDTO from "api/DTOs/matches/schedule/IScheduleMatchRequestDTO";
import Team from "domain/entities/Team";
import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";
import supertest from "supertest";

let away_team: Team;
let home_team: Team;
let default_request: IScheduleMatchRequestDTO;

const wasCreated = async () => {
    const rows = await db.queryRows<IMatchSchema>({
        statement: "SELECT * FROM matches",
    });
    expect(rows.length).toBe(1);
};

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();
    const mixins = new Mixins();
    away_team = await mixins.createTeam(1);
    home_team = await mixins.createTeam(2);

    default_request = {
        awayTeamId: away_team.id.value,
        homeTeamId: home_team.id.value,
        scheduledDate: new Date(),
        venue: "venue place",
    };
});

describe("Schedule Match Integration Test;", () => {
    it("Schedule Match; Valid Data; Success", async () => {
        const request = { ...default_request };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/schedule`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        await wasCreated();
    });

    it.each([
        [() => ({ homeTeamId: home_team.id, awayTeamId: "does_not_exist" })],
        [() => ({ homeTeamId: "does_not_exist", awayTeamId: away_team.id })],
        [
            () => ({
                homeTeamId: "does_not_exist",
                awayTeamId: "does_not_exist",
            }),
        ],
    ])("Schedule Match; Team does not exist; Failure", async (teams) => {
        const request = { ...default_request, ...teams() };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/schedule`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
    });
});
