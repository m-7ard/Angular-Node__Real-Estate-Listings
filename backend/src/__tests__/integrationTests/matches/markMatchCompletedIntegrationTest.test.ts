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
import IMarkMatchCompletedRequestDTO from "api/DTOs/matches/markMatchCompleted/IMarkMatchCompletedRequestDTO";
import { DateTime } from "luxon";

let team_001: Team;
let team_002: Team;
let scheduled_match: Match;
let in_progress_match: Match;
let completed_match: Match;
let cancelled_match: Match;
let default_request: IMarkMatchCompletedRequestDTO;

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
    in_progress_match = await mixins.createInProgressMatch({
        seed: 3,
        awayTeam: team_001,
        homeTeam: team_002,
        goals: [],
    });

    const endDate = DateTime.fromJSDate(in_progress_match.matchDates.startDate!)
        .plus({ minutes: 90 })
        .toJSDate();
      
    default_request = {
        endDate: endDate,
    };

    completed_match = await mixins.createCompletedMatch({
        seed: 1,
        awayTeam: team_001,
        homeTeam: team_002,
        goals: []
    });

    scheduled_match = await mixins.createScheduledMatch({
        seed: 2,
        awayTeam: team_001,
        homeTeam: team_002,
    });

    cancelled_match = await mixins.createCancelledMatch({
        seed: 4,
        awayTeam: team_001,
        homeTeam: team_002,
    });
});

describe("Mark Match Completed Integration Test;", () => {
    it("Mark Match Completed; Valid Match; Success;", async () => {
        const request = { ...default_request };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${in_progress_match.id}/mark_completed`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
    });

    it("Mark Match Completed; Match does not exist; Failure;", async () => {
        const request = { ...default_request };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${"does_not_exist"}/mark_completed`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(404);
    });

    it("Mark Match Completed; Invalid endDate; Failure;", async () => {
        const request = { ...default_request };
        const endDate = new Date(in_progress_match.matchDates.startDate!);

        request.endDate = endDate;

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${in_progress_match.id}/mark_completed`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
    });

    it.each([
        [() => scheduled_match],
        [() => completed_match],
        [() => cancelled_match],
    ])(
        "Mark Match Completed; Match cannot transition status; Failure;",
        async (getMatch) => {
            const match = getMatch();
            const request = { ...default_request };

            const response = await adminSuperTest({
                agent: supertest(server)
                    .post(`/api/matches/${match.id}/mark_completed`)
                    .send(request)
                    .set("Content-Type", "application/json"),
                seed: 1,
            });

            expect(response.status).toBe(400);
        },
    );
});
