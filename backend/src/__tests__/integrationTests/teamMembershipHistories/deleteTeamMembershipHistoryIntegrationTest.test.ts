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
import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import TeamMembershipHistoryPosition from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryPosition";
import TeamRepository from "infrastructure/repositories/TeamRepository";
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import TeamMembership from "domain/entities/TeamMembership";
import TeamMembershipHistory from "domain/entities/TeamMembershipHistory";
import IDeleteTeamMembershipHistoryResponseDTO from "api/DTOs/teamMembershipHistories/delete/IDeleteTeamMembershipHistoryResponseDTO";
import IDeleteTeamMembershipRequestDTO from "api/DTOs/teamMemberships/delete/IDeleteTeamMembershipRequestDTO";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";

let team_001: Team;
let player_001: Player;
let team_membership_001: TeamMembership;
let team_membership_history_001: TeamMembershipHistory;

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
    team_membership_001 = await mixins.createTeamMembership(player_001, team_001, null);
    team_membership_history_001 = await mixins.createTeamMembershipHistory(team_001, team_membership_001, {
        dateEffectiveFrom: team_membership_001.teamMembershipDates.activeFrom,
        position: TeamMembershipHistoryPosition.GOALKEEPER.value,
        number: 1,
    });

    expect(team_001).toBeDefined();
    expect(player_001).toBeDefined();
});

describe("Delete TeamMembershipHistory Integration Test;", () => {
    it("Delete TeamMembershipHistory; Valid data; Success;", async () => {
        const request: IDeleteTeamMembershipRequestDTO = {};

        const response = await adminSuperTest({
            agent: supertest(server)
                .delete(
                    `/api/teams/${team_001.id}/memberships/${team_membership_001.id}/histories/${team_membership_history_001.id}/delete`,
                )
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
        const body: IDeleteTeamMembershipHistoryResponseDTO = response.body;
        const repo = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
        const team = (await repo.getByIdAsync(team_001.id))!;
        const teamMembership = team.findMemberById(TeamMembershipId.executeCreate(body.teamMembershipId))!;
        expect(teamMembership.teamMembershipHistories.length).toBe(0);
    });

    it("Delete TeamMembershipHistory; History does not exist; Success;", async () => {
        const request: IDeleteTeamMembershipRequestDTO = {};

        const response = await adminSuperTest({
            agent: supertest(server)
                .delete(`/api/teams/${team_001.id}/memberships/${team_membership_001.id}/histories/INVALID/delete`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
    });
});
