import supertest from "supertest";
import {
    disposeIntegrationTest,
    resetIntegrationTest,
    server,
    setUpIntegrationTest,
} from "../../../__utils__/integrationTests/integrationTest.setup";
import Mixins from "../../../__utils__/integrationTests/Mixins";
import Team from "domain/entities/Team";
import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import Match from "domain/entities/Match";
import IReadMatchResponseDTO from "api/DTOs/matches/read/IReadMatchResponseDTO";
import Player from "domain/entities/Player";
import TeamMembership from "domain/entities/TeamMembership";

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

describe("Read Match Integration Test;", () => {
    it("Read Match; Existing Match; Success;", async () => {
        const response = await adminSuperTest({
            agent: supertest(server)
                .get(`/api/matches/${match_001.id}`)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
        const body: IReadMatchResponseDTO = response.body;
        expect(body.match.id).toBe(match_001.id);
        expect(body.matchParticipants.awayTeamPlayers.length).toBe(1);
        expect(body.matchParticipants.homeTeamPlayers.length).toBe(1);
    });

    it("Read Match; Match does not exist; Failure;", async () => {
        const response = await adminSuperTest({
            agent: supertest(server)
                .get(`/api/matches/${"does_not_exist"}`)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(404);
    });
});
