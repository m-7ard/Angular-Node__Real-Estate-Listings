import supertest from "supertest";
import {
    db,
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "../../../__utils__/integrationTests/Mixins";
import Team from "domain/entities/Team";
import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import Match from "domain/entities/Match";
import IMarkMatchCancelledRequestDTO from "api/DTOs/matches/markMatchCancelled/IMarkMatchCancelledRequestDTO";

let team_001: Team;
let team_002: Team;
let scheduled_match: Match;
let in_progress_match: Match;
let completed_match: Match;
let cancelled_match: Match;
let default_request: IMarkMatchCancelledRequestDTO;

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
    default_request = {};

    completed_match = await mixins.createCompletedMatch({
        seed: 1,
        awayTeam: team_001,
        homeTeam: team_002,
        goals: [],
    });

    scheduled_match = await mixins.createScheduledMatch({
        seed: 2,
        awayTeam: team_001,
        homeTeam: team_002,
    });

    in_progress_match = await mixins.createInProgressMatch({
        seed: 3,
        awayTeam: team_001,
        homeTeam: team_002,
        goals: [],
    });

    cancelled_match = await mixins.createCancelledMatch({
        seed: 4,
        awayTeam: team_001,
        homeTeam: team_002,
    });
});

describe("Mark Match Cancelled Integration Test;", () => {
    it.each([
        [() => scheduled_match],
        [() => in_progress_match],
        [() => completed_match],
    ])("Mark Match Cancelled; Valid Match; Success;", async (getMatch) => {
        const request = { ...default_request };
        const match = getMatch();

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${match.id}/mark_cancelled`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
    });

    it("Mark Match Cancelled; Match does not exist; Failure;", async () => {
        const request = { ...default_request };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${"does_not_exist"}/mark_cancelled`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(404);
    });

    it("Mark Match Cancelled; Match cannot transition status; Failure;", async () => {
        const request = { ...default_request };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${cancelled_match.id}/mark_cancelled`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
    });
});
