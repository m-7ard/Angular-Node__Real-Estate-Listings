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
import IUpdateTeamMembershipRequestDTO from "api/DTOs/teamMemberships/update/IUpdateTeamMembershipRequestDTO";
import TeamMembership from "domain/entities/TeamMembership";
import ITeamMembershipSchema from "infrastructure/dbSchemas/ITeamMembershipSchema";
import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import { DateTime } from "luxon";

let team_001: Team;
let player_001: Player;
let teamMembership_001: TeamMembership;
const INVALID_ID = "INVALID";

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

describe("Update TeamMembership Integration Test;", () => {
    it("Update Team Membership; Valid Data; Success;", async () => {
        const request: IUpdateTeamMembershipRequestDTO = {
            activeFrom: teamMembership_001.teamMembershipDates.activeFrom,
            activeTo: DateTime.fromJSDate(teamMembership_001.teamMembershipDates.activeFrom).plus({ minute: 1 }).toJSDate(),
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .put(
                    `/api/teams/${team_001.id}/memberships/${teamMembership_001.id}/update`,
                )
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
        const [row] = await db.queryRows<ITeamMembershipSchema>({
            statement: "SELECT * FROM team_membership",
        });
        expect(row.active_to).not.toBeNull();
        expect(row.active_to?.getTime()).toBeGreaterThanOrEqual(
            row.active_from.getTime(),
        );
    });

    it("Update Team Membership; Team does not exist; Failure;", async () => {
        const request: IUpdateTeamMembershipRequestDTO = {
            activeFrom: teamMembership_001.teamMembershipDates.activeFrom,
            activeTo: new Date(),
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .put(`/api/teams/${INVALID_ID}/memberships/${teamMembership_001.id}/update`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });

    it("Update Team Membership; Team Membership does not exist; Failure;", async () => {
        const request: IUpdateTeamMembershipRequestDTO = {
            activeFrom: teamMembership_001.teamMembershipDates.activeFrom,
            activeTo: new Date(),
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .put(`/api/teams/${team_001.id}/memberships/${INVALID_ID}/update`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
        const body: IApiError[] = response.body;
        expect(body[0].code).toBe(API_ERROR_CODES.APPLICATION_ERROR);
    });
});
