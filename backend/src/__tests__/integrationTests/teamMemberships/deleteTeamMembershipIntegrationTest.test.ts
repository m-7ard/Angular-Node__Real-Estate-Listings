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
import Player from "domain/entities/Player";
import API_ERROR_CODES from "api/errors/API_ERROR_CODES";
import IApiError from "api/errors/IApiError";
import TeamMembership from "domain/entities/TeamMembership";
import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import ITeamMembershipSchema from "infrastructure/dbSchemas/ITeamMembershipSchema";
import IDeleteTeamMembershipRequestDTO from "api/DTOs/teamMemberships/delete/IDeleteTeamMembershipRequestDTO";

let team_001: Team;
let player_001: Player;
let teamMembership_001: TeamMembership;

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
    player_001 = await mixins.createPlayer(1);
    teamMembership_001 = await mixins.createTeamMembership(
        player_001,
        team_001,
        null,
    );

    expect(team_001).toBeDefined();
    expect(player_001).toBeDefined();
});

describe("Delete TeamMembership Integration Test;", () => {
    it("Delete Team Membership; Valid Data; Success;", async () => {
        const request: IDeleteTeamMembershipRequestDTO = {};

        const response = await adminSuperTest({
            agent: supertest(server)
                .delete(
                    `/api/teams/${team_001.id}/memberships/${teamMembership_001.id}/delete`,
                )
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
        const rows = await db.queryRows<ITeamMembershipSchema>({
            statement: "SELECT * FROM team_membership",
        });
        expect(rows.length).toBe(0);
    });

    it("Delete Team Membership; Team does not exist; Failure;", async () => {
        const INVALID_TEAM_ID = "INVALID";

        const request: IDeleteTeamMembershipRequestDTO = {};

        const response = await adminSuperTest({
            agent: supertest(server)
                .delete(
                    `/api/teams/${INVALID_TEAM_ID}/memberships/${teamMembership_001.id}/delete`,
                )
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });

    it("Delete Team Membership; TeamMembership does not exist; Failure;", async () => {
        const INVALID_ID = "INVALID";

        const request: IDeleteTeamMembershipRequestDTO = {};

        const response = await adminSuperTest({
            agent: supertest(server)
                .delete(
                    `/api/teams/${team_001.id}/memberships/${INVALID_ID}/delete`,
                )
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });
});
