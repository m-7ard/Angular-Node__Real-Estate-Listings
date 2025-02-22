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
import ICreateTeamMembershipHistoryRequestDTO from "api/DTOs/teamMembershipHistories/create/ICreateTeamMembershipHistoryRequestDTO";
import ICreateTeamMembershipHistoryResponseDTO from "api/DTOs/teamMembershipHistories/create/ICreateTeamMembershipHistoryResponseDTO";
import TeamMembership from "domain/entities/TeamMembership";
import { DateTime } from "luxon";
import TeamMembershipHistoryId from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryId";
import diContainer, { DI_TOKENS } from "api/deps/diContainer";

let team_001: Team;
let player_001: Player;
let team_membership_001: TeamMembership;

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

    expect(team_001).toBeDefined();
    expect(player_001).toBeDefined();
});

describe("Create TeamMembershipHistory Integration Test;", () => {
    it("Create TeamMembershipHistory; Valid first history; Success;", async () => {
        const request: ICreateTeamMembershipHistoryRequestDTO = {
            dateEffectiveFrom: team_membership_001.teamMembershipDates.activeFrom,
            number: 5,
            position: TeamMembershipHistoryPosition.ATTACKING_MIDFIELDER.value,
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/teams/${team_001.id}/memberships/${team_membership_001.id}/histories/create`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        const body: ICreateTeamMembershipHistoryResponseDTO = response.body;
        const repo = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
        const team = (await repo.getByIdAsync(team_001.id))!;
        const teamMembership = team.findMemberById(TeamMembershipId.executeCreate(body.teamMembershipId))!;
        expect(teamMembership.teamMembershipHistories.length).toBe(1);
        const [history] = teamMembership.teamMembershipHistories;
        expect(history.id.value).toBe(body.teamMembershipHistoryId);
    });

    it("Create TeamMembershipHistory; Valid second history; Success;", async () => {
        team_001.executeAddHistoryToTeamMembership(team_membership_001.id, {
            id: crypto.randomUUID(),
            dateEffectiveFrom: team_membership_001.teamMembershipDates.activeFrom,
            number: 1,
            position: TeamMembershipHistoryPosition.GOALKEEPER.value,
        });
        const repo = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
        await repo.updateAsync(team_001);

        const request: ICreateTeamMembershipHistoryRequestDTO = {
            dateEffectiveFrom: DateTime.fromJSDate(team_membership_001.teamMembershipDates.activeFrom)
                .plus({ minute: 1 })
                .toJSDate(),
            number: 10,
            position: TeamMembershipHistoryPosition.CENTER_FORWARD.value,
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/teams/${team_001.id}/memberships/${team_membership_001.id}/histories/create`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        const body: ICreateTeamMembershipHistoryResponseDTO = response.body;
        const team = (await repo.getByIdAsync(team_001.id))!;
        const teamMembership = team.findMemberById(TeamMembershipId.executeCreate(body.teamMembershipId))!;
        expect(teamMembership.teamMembershipHistories.length).toBe(2);
        const teamMembershipHistory = teamMembership.teamMembershipHistories.find(
            (history) => history.id.value == body.teamMembershipHistoryId,
        );
        expect(teamMembershipHistory).not.toBeNull();
        expect(teamMembershipHistory?.numberValueObject.value).toBe(10);
        expect(teamMembershipHistory?.positionValueObject.value).toBe(
            TeamMembershipHistoryPosition.CENTER_FORWARD.value,
        );
    });

    it("Create TeamMembershipHistory; Invalid data (date out of range); Success;", async () => {
        team_001.executeUpdateMember(team_membership_001.id, player_001, {
            activeFrom: new Date(),
            activeTo: new Date(),
        });
        const repo = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
        await repo.updateAsync(team_001);

        const request: ICreateTeamMembershipHistoryRequestDTO = {
            dateEffectiveFrom: DateTime.fromJSDate(team_membership_001.teamMembershipDates.activeFrom)
                .plus({ minute: 100 })
                .toJSDate(),
            number: 10,
            position: TeamMembershipHistoryPosition.CENTER_FORWARD.value,
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .post(`/api/teams/${team_001.id}/memberships/${team_membership_001.id}/histories/create`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
    });
});
