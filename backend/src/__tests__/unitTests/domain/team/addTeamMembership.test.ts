import Mixins from "__utils__/unitTests/Mixins";
import plusOneMinute from "__utils__/unitTests/plusOneMinute";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import { DateTime } from "luxon";

let player_001: Player;
let team_001: Team;

beforeAll(() => {});

afterAll(() => {});

beforeEach(async () => {
    player_001 = Mixins.createNewPlayer(1);
    team_001 = Mixins.createNewTeam(1);
    // const teamMembership_001 = Mixins.createTeamMembership()
});

describe("Create Team Membership;", () => {
    it("Create Team Membership; Valid First Team Membership; Success;", async () => {
        const props = { id: "1", player: player_001, activeFrom: new Date(), activeTo: null };
        const canAddMember = team_001.canAddMember(props);
        expect(canAddMember.isOk());
        team_001.executeAddMember(props);
        expect(team_001.teamMemberships.length).toBe(1);
    });

    it("Create Team Membership; Valid Second Team Membership; Success;", async () => {
        team_001.executeAddMember({ id: "1", player: player_001, activeFrom: new Date(), activeTo: new Date() });

        const props = { id: "2", player: player_001, activeFrom: plusOneMinute(new Date()), activeTo: null };
        const canAddMember = team_001.canAddMember(props);
        expect(canAddMember.isOk());
        team_001.executeAddMember(props);
        expect(team_001.teamMemberships.length).toBe(2);
    });

    it("Create Team Membership; Invalid First Team Membership (Before team founded); Failure;", async () => {
        const canAddMember = team_001.canAddMember({ id: "1", player: player_001, activeFrom: DateTime.fromJSDate(team_001.dateFounded).minus({ minutes: 1 }).toJSDate(), activeTo: null });
        expect(canAddMember.isErr());
    });

    it("Create Team Membership; Invalid First Team Membership (Invalid active* dates); Failure;", async () => {
        const activeFrom = new Date();
        const canAddMember = team_001.canAddMember({ id: "1", player: player_001, activeFrom: activeFrom, activeTo: DateTime.fromJSDate(activeFrom).minus({ minutes: 1 }).toJSDate() });
        expect(canAddMember.isErr());
    });

    it.each([
        // previous membership is still active
        [
            { activeFrom: new Date(), activeTo: null },
            { activeFrom: new Date(), activeTo: new Date() },
        ],
        // previous membership is within new range (new membership is active before the previous one)
        [
            { activeFrom: new Date(), activeTo: new Date() },
            { activeFrom: DateTime.fromJSDate(new Date()).minus({ minutes: 1 }).toJSDate(), activeTo: null },
        ],
        [
            { activeFrom: new Date(), activeTo: new Date() },
            { activeFrom: DateTime.fromJSDate(new Date()).minus({ minutes: 1 }).toJSDate(), activeTo: DateTime.fromJSDate(new Date()).plus({ hours: 10 }).toJSDate() },
        ],
        // previous membership is within new range (new membership is active after the previous one)
        [
            { activeFrom: new Date(), activeTo: DateTime.fromJSDate(new Date()).plus({ minutes: 1 }).toJSDate() },
            { activeFrom: new Date(), activeTo: null },
        ],
    ])("Create Team Membership; Invalid Second Team Membership (Conflict of active* dates); Failure;", async (previousDates, newDates) => {
        team_001.canAddMember({ id: "1", player: player_001, activeFrom: previousDates.activeFrom, activeTo: previousDates.activeTo });
        const canAddMember = team_001.canAddMember({ id: "1", player: player_001, activeFrom: newDates.activeFrom, activeTo: newDates.activeTo });
        expect(canAddMember.isErr());
    });

    it("Create Team Membership; activeFrom before player; Failure;", async () => {
        team_001.executeUpdateDateFounded(DateTime.fromJSDate(new Date()).minus({ days: 100 }).toJSDate());
        player_001.activeSince = DateTime.fromJSDate(new Date()).minus({ days: 1 }).toJSDate();

        const canAddMember = team_001.canAddMember({ id: "1", player: player_001, activeFrom: DateTime.fromJSDate(new Date()).minus({ days: 2 }).toJSDate(), activeTo: null });
        expect(canAddMember.isErr());
    });

    it("Create Team Membership; activeFrom before team; Failure;", async () => {
        team_001.executeUpdateDateFounded(DateTime.fromJSDate(new Date()).minus({ days: 1 }).toJSDate());
        player_001.activeSince = DateTime.fromJSDate(new Date()).minus({ days: 100 }).toJSDate();

        const canAddMember = team_001.canAddMember({ id: "1", player: player_001, activeFrom: DateTime.fromJSDate(new Date()).minus({ days: 2 }).toJSDate(), activeTo: null });
        expect(canAddMember.isErr());
    });
});
