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
import TeamMembership from "domain/entities/TeamMembership";
import { adminSuperTest } from "__utils__/integrationTests/authSupertest";
import { DateTime } from "luxon";
import TeamMembershipHistory from "domain/entities/TeamMembershipHistory";
import TeamMembershipHistoryPosition from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryPosition";
import IListTeamMembershipHistoriesRequestDTO from "api/DTOs/teamMemberships/list-histories/IListTeamMembershipHistoriesRequestDTO";
import IListTeamMembershipHistoriesResponseDTO from "api/DTOs/teamMemberships/list-histories/IListTeamMembershipHistoriesResponseDTO";

let team_001: Team;
let player_001: Player;
let teamMembership_001: TeamMembership;
let teamMembershipHistory_001: TeamMembershipHistory;
let teamMembershipHistory_002: TeamMembershipHistory;
let teamMembershipHistory_003: TeamMembershipHistory;
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
    teamMembership_001 = await mixins.createTeamMembership(player_001, team_001, null);
    teamMembershipHistory_001 = await mixins.createTeamMembershipHistory(team_001, teamMembership_001, {
        position: TeamMembershipHistoryPosition.ATTACKING_MIDFIELDER.value,
        number: 1,
        dateEffectiveFrom: DateTime.fromJSDate(teamMembership_001.teamMembershipDates.activeFrom)
            .plus({ minutes: 1 })
            .toJSDate(),
    });
    teamMembershipHistory_002 = await mixins.createTeamMembershipHistory(team_001, teamMembership_001, {
        position: TeamMembershipHistoryPosition.ATTACKING_MIDFIELDER.value,
        number: 2,
        dateEffectiveFrom: DateTime.fromJSDate(teamMembership_001.teamMembershipDates.activeFrom)
            .plus({ minutes: 2 })
            .toJSDate(),
    });
    teamMembershipHistory_003 = await mixins.createTeamMembershipHistory(team_001, teamMembership_001, {
        position: TeamMembershipHistoryPosition.ATTACKING_MIDFIELDER.value,
        number: 3,
        dateEffectiveFrom: DateTime.fromJSDate(teamMembership_001.teamMembershipDates.activeFrom)
            .plus({ minutes: 3 })
            .toJSDate(),
    });
});

describe("Read TeamMembership Histories Integration Test;", () => {
    it("Read TeamMembership Histories; Valid Team and Membership; Success;", async () => {
        const request: IListTeamMembershipHistoriesRequestDTO = {};

        const response = await adminSuperTest({
            agent: supertest(server)
                .get(`/api/teams/${team_001.id}/memberships/${teamMembership_001.id}/histories/`)
                .send(request)
                .set("Content-Type", "application/json"),
            seed: 1,
        });

        expect(response.status).toBe(200);
        
        const body: IListTeamMembershipHistoriesResponseDTO = response.body;
        expect(body.teamMembershipHistories.length).toBe(3);
        expect(body.teamPlayer.membership.effectiveHistory).toBe(null);
    });
});
