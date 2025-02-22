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
import TeamMembershipId from "domain/valueObjects/TeamMembership/TeamMembershipId";
import TeamMembership from "domain/entities/TeamMembership";
import { DateTime } from "luxon";
import IUpdateTeamMembershipHistoryRequestDTO from "api/DTOs/teamMembershipHistories/update/IUpdateTeamMembershipHistoryRequestDTO";
import TeamMembershipHistory from "domain/entities/TeamMembershipHistory";
import IUpdateTeamMembershipHistoryResponseDTO from "api/DTOs/teamMembershipHistories/update/IUpdateTeamMembershipHistoryResponseDTO";
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

describe("Update TeamMembershipHistory Integration Test;", () => {
    it("Update TeamMembershipHistory; Valid data; Success;", async () => {
        const request: IUpdateTeamMembershipHistoryRequestDTO = {
            dateEffectiveFrom: team_membership_001.teamMembershipDates.activeFrom,
            number: 5,
            position: TeamMembershipHistoryPosition.ATTACKING_MIDFIELDER.value,
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .put(
                    `/api/teams/${team_001.id}/memberships/${team_membership_001.id}/histories/${team_membership_history_001.id}/update`,
                )
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(201);
        const body: IUpdateTeamMembershipHistoryResponseDTO = response.body;
        const repo = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
        const team = (await repo.getByIdAsync(team_001.id))!;
        const teamMembership = team.findMemberById(TeamMembershipId.executeCreate(body.teamMembershipId))!;
        expect(teamMembership.teamMembershipHistories.length).toBe(1);
        const [history] = teamMembership.teamMembershipHistories;
        expect(history.id.value).toBe(body.teamMembershipHistoryId);
        expect(history.positionValueObject.value).toBe(request.position);
        expect(history.numberValueObject.value).toBe(request.number);
    });

    it("Update TeamMembershipHistory; Invalid data (date out of range); Success;", async () => {
        team_001.executeUpdateMember(team_membership_001.id, player_001, {
            activeFrom: new Date(),
            activeTo: DateTime.fromJSDate(team_membership_history_001.dateEffectiveFrom).plus({ minute: 1 }).toJSDate(),
        });
        const repo = diContainer.resolve(DI_TOKENS.TEAM_REPOSITORY);
        await repo.updateAsync(team_001);

        const request: IUpdateTeamMembershipHistoryRequestDTO = {
            dateEffectiveFrom: DateTime.fromJSDate(team_membership_001.teamMembershipDates.activeFrom)
                .plus({ minute: 100 })
                .toJSDate(),
            number: 10,
            position: TeamMembershipHistoryPosition.CENTER_FORWARD.value,
        };

        const response = await adminSuperTest({
            agent: supertest(server)
                .put(
                    `/api/teams/${team_001.id}/memberships/${team_membership_001.id}/histories/${team_membership_history_001.id}/update`,
                )
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(400);
    });
});
