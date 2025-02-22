import Mixins from "__utils__/unitTests/Mixins";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import TeamMembership from "domain/entities/TeamMembership";
import TeamMembershipHistory from "domain/entities/TeamMembershipHistory";

let player_001: Player;
let team_001: Team;
let teamMembership_001: TeamMembership;

let validTeamMembershipHistory: TeamMembershipHistory;
let futureTeamMembershipHistories: TeamMembershipHistory[];

beforeAll(() => {});

afterAll(() => {});

beforeEach(async () => {
    player_001 = Mixins.createOldPlayer(1);
    team_001 = Mixins.createOldTeam(1);
    teamMembership_001 = Mixins.createTeamMembership(player_001, team_001, null);
    validTeamMembershipHistory = Mixins.createStartTeamMembershipHistory(teamMembership_001, 1);
    futureTeamMembershipHistories = Array.from({ length: 10 }, (_, i) => Mixins.createFutureTeamMembershipHistory(teamMembership_001, 100 + i));
});

describe("Get Effective History;", () => {
    it("Get Effective History; Valid Expected Result; Success;", async () => {
        const effectiveHistory = teamMembership_001.getEffectiveHistory();
        expect(effectiveHistory).toBe(validTeamMembershipHistory);
    });

    it("Get Effective History For Date; Valid Expected Result; Success;", async () => {
        const lookupHistory = futureTeamMembershipHistories[5];
        const effectiveHistory = teamMembership_001.getEffectiveHistoryForDate(lookupHistory.dateEffectiveFrom);
        expect(effectiveHistory).toBe(lookupHistory);
    });
});
