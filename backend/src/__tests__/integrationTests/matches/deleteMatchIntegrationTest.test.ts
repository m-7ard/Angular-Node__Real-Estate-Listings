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
import Player from "domain/entities/Player";
import TeamMembership from "domain/entities/TeamMembership";
import IMatchSchema from "infrastructure/dbSchemas/IMatchSchema";
import MatchDbEntity from "infrastructure/dbEntities/MatchDbEntity";

let awayTeam: Team;
let homeTeam: Team;
let match_001: Match;

let player_001: Player;
let player_002: Player;

let awayTeamMembership: TeamMembership;
let homeTeamMembership: TeamMembership;

beforeAll(async () => {
    await setUpIntegrationTest();
});

afterAll(async () => {
    await disposeIntegrationTest();
});

beforeEach(async () => {
    await resetIntegrationTest();
    const mixins = new Mixins();
    awayTeam = await mixins.createTeam(1);
    homeTeam = await mixins.createTeam(2);
    match_001 = await mixins.createScheduledMatch({
        seed: 1,
        awayTeam: awayTeam,
        homeTeam: homeTeam,
    });

    player_001 = await mixins.createPlayer(1);
    player_002 = await mixins.createPlayer(2);

    awayTeamMembership = await mixins.createTeamMembership(player_001, awayTeam, null);
    homeTeamMembership = await mixins.createTeamMembership(player_002, homeTeam, null);
});

describe("Delete Match Integration Test;", () => {
    it("Delete Match; Existing Match; Success;", async () => {
        const response = await adminSuperTest({
            agent: supertest(server)
                .delete(`/api/matches/${match_001.id}/delete`)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
        const matches = await db.queryRows<IMatchSchema>({ statement: `SELECT * FROM ${MatchDbEntity.TABLE_NAME}` });
        expect(matches.length).toBe(0);
    });

    it("Delete Match; Match does not exist; Failure;", async () => {
        const response = await adminSuperTest({
            agent: supertest(server)
                .delete(`/api/matches/${"does_not_exist"}/delete`)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(404);
    });
});
