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
import IMarkMatchInProgressRequestDTO from "api/DTOs/matches/markMatchInProgress/IMarkMatchInProgressRequestDTO";
import { DateTime } from "luxon";

let team_001: Team;
let team_002: Team;
let scheduled_match: Match;
let in_progress_match: Match;
let completed_match: Match;
let cancelled_match: Match;
let default_request: IMarkMatchInProgressRequestDTO;

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
    scheduled_match = await mixins.createScheduledMatch({
        seed: 1,
        awayTeam: team_001,
        homeTeam: team_002,
    });


    const startDate = DateTime.fromJSDate(scheduled_match.matchDates.scheduledDate).plus({ minutes: 1 });

    default_request = {
        startDate: startDate.toJSDate(),
    };

    in_progress_match = await mixins.createInProgressMatch({
        seed: 2,
        awayTeam: team_001,
        homeTeam: team_002,
        goals: []
    });

    completed_match = await mixins.createCompletedMatch({
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

describe("Mark Match In Progress Integration Test;", () => {
    it("Mark Match In Progress; Valid Match; Success;", async () => {
        const request = { ...default_request };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${scheduled_match.id}/mark_in_progress`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
    });

    it("Mark Match In Progress; Match does not exist; Failure;", async () => {
        const request = { ...default_request };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${"does_not_exist"}/mark_in_progress`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(404);
    });

    it("Mark Match In Progress; Invalid startDate; Failure;", async () => {
        const request = { ...default_request };
        const startDate = DateTime.fromJSDate(in_progress_match.matchDates.scheduledDate!)
            .minus({ minutes: 1 })
            .toJSDate();

        request.startDate = startDate;

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${scheduled_match.id}/mark_in_progress`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
    });

    it.each([
        [() => in_progress_match],
        [() => completed_match],
        [() => cancelled_match],
    ])(
        "Mark Match In Progress; Match cannot transition status; Failure;",
        async (getMatch) => {
            const match = getMatch();
            const request = { ...default_request };

            const response = await adminSuperTest({
                agent: supertest(server)
                    .post(`/api/matches/${match.id}/mark_in_progress`)
                    .send(request)
                    .set("Content-Type", "application/json"),
                seed: 1,
            });

            expect(response.status).toBe(400);
        },
    );
});
