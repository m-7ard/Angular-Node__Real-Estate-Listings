import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import {
    db,
    setUpIntegrationTest,
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
} from "__utils__/integrationTests/integrationTest.setup";
import Mixins from "__utils__/integrationTests/Mixins";
import IRecordGoalRequestDTO from "api/DTOs/matchEvents/recordGoal/IRecordGoalRequestDTO";
import Match from "domain/entities/Match";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import TeamMembership from "domain/entities/TeamMembership";
import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";
import { DateTime } from "luxon";
import supertest from "supertest";

let away_team: Team;
let home_team: Team;
let in_progress_match: Match;
let goal_player: Player;
let goal_player_membership: TeamMembership;
let default_request: IRecordGoalRequestDTO;

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
    goal_player = await mixins.createPlayer(1);
    goal_player_membership = await mixins.createTeamMembership(
        goal_player,
        away_team,
        null,
    );
    in_progress_match = await mixins.createInProgressMatch({
        seed: 1,
        awayTeam: away_team,
        homeTeam: home_team,
        goals: [],
    });

    const dateOccured = DateTime.fromJSDate(in_progress_match.matchDates.startDate!)
        .plus({ minutes: 1 })
        .toJSDate();

    default_request = {
        teamId: goal_player_membership.teamId.value,
        playerId: goal_player.id.value,
        dateOccured: dateOccured,
    };
});

describe("Record Goal Integration Test;", () => {
    it("Record Goal; Valid Data; Success;", async () => {
        const request = { ...default_request };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${in_progress_match.id}/record_goal`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        await wasCreated();
    });

    it("Record Goal; Team does not exist; Failure;", async () => {
        const request = { ...default_request };
        request.teamId = "does_not_exist";

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${in_progress_match.id}/record_goal`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        await wasCreated();
    });

    it("Record Goal; Player does not exist; Failure;", async () => {
        const request = { ...default_request };
        request.playerId = "does_not_exist";

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${in_progress_match.id}/record_goal`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        await wasCreated();
    });

    it("Record Goal; Invalid dateOcurred; Failure;", async () => {
        const request = { ...default_request };
        request.dateOccured = DateTime.fromJSDate(in_progress_match.matchDates.startDate!)
            .minus({ minutes: 1 })
            .toJSDate();

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/matches/${in_progress_match.id}/record_goal`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });
        
        expect(response.status).toBe(400);
        await wasCreated();
    });
});
