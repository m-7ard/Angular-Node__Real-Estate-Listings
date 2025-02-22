import MatchFactory from "domain/domainFactories/MatchFactory";
import PlayerFactory from "domain/domainFactories/PlayerFactory";
import TeamFactory from "domain/domainFactories/TeamFactory";
import UserFactory from "domain/domainFactories/UserFactory";
import Player from "domain/entities/Player";
import Team from "domain/entities/Team";
import TeamMembership from "domain/entities/TeamMembership";
import MatchDates from "domain/valueObjects/Match/MatchDates";
import MatchScore from "domain/valueObjects/Match/MatchScore";
import MatchStatus from "domain/valueObjects/Match/MatchStatus";
import PlayerId from "domain/valueObjects/Player/PlayerId";
import TeamId from "domain/valueObjects/Team/TeamId";
import TeamMembershipHistoryId from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryId";
import TeamMembershipHistoryPosition from "domain/valueObjects/TeamMembershipHistory/TeamMembershipHistoryPosition";
import { DateTime } from "luxon";

class Mixins {
    static createNewTeam(seed: number) {
        const team = TeamFactory.CreateNew({
            id: TeamId.executeCreate(`${seed}`),
            name: `team_${seed}`,
            dateFounded: new Date(),
            teamMemberships: [],
        });

        return team;
    }

    static createOldTeam(seed: number) {
        const team = TeamFactory.CreateNew({
            id: TeamId.executeCreate(`${seed}`),
            name: `team_${seed}`,
            dateFounded: DateTime.fromJSDate(new Date()).minus({ days: 1 }).toJSDate(),
            teamMemberships: [],
        });

        return team;
    }

    static createNewPlayer(seed: number) {
        const player = PlayerFactory.CreateNew({
            id: PlayerId.executeCreate(`${seed}`),
            name: `player_${seed}`,
            activeSince: new Date(Date.now()),
        });

        return player;
    }

    static createOldPlayer(seed: number) {
        const player = PlayerFactory.CreateNew({
            id: PlayerId.executeCreate(`${seed}`),
            name: `player_${seed}`,
            activeSince: DateTime.fromJSDate(new Date()).minus({ days: 1 }).toJSDate(),
        });

        return player;
    }

    static createTeamMembership(player: Player, team: Team, activeTo: Date | null) {
        const teamMembershipId = team.executeAddMember({
            id: crypto.randomUUID(),
            activeFrom: DateTime.fromJSDate(team.dateFounded).plus({ minute: 1 }).toJSDate(),
            activeTo: activeTo,
            player: player,
        });

        return team.executeFindMemberById(teamMembershipId);
    }

    static createStartTeamMembershipHistory(teamMembership: TeamMembership, seed: number) {
        const teamMembershipId = teamMembership.executeAddHistory({
            id: seed.toString(),
            dateEffectiveFrom: teamMembership.teamMembershipDates.activeFrom,
            number: 1,
            position: TeamMembershipHistoryPosition.GOALKEEPER.value,
        });
        const teamMembershipHistory = teamMembership.executeFindHistoryById(teamMembershipId);

        return teamMembershipHistory;
    }

    static createFutureTeamMembershipHistory(teamMembership: TeamMembership, seed: number) {
        const teamMembershipId = teamMembership.executeAddHistory({
            id: seed.toString(),
            dateEffectiveFrom: DateTime.fromJSDate(new Date()).plus({ years: 1, seconds: seed }).toJSDate(),
            number: 1,
            position: TeamMembershipHistoryPosition.GOALKEEPER.value,
        });
        const teamMembershipHistory = teamMembership.executeFindHistoryById(teamMembershipId);

        return teamMembershipHistory;
    }

    static createUser(seed: number, isAdmin: boolean) {
        const password = `hashed_password_${seed}`;
        const user = UserFactory.CreateNew({
            id: `${seed}`,
            name: `user_${seed}`,
            email: `user_${seed}@email.com`,
            hashedPassword: password,
            isAdmin: isAdmin,
        });

        return { user, password };
    }

    static createScheduledMatch(props: { seed: number; awayTeam: Team; homeTeam: Team }) {
        const date = new Date();
        return Mixins.createMatch({
            seed: props.seed,
            awayTeam: props.awayTeam,
            homeTeam: props.homeTeam,
            scheduledDate: date,
            startDate: null,
            endDate: null,
            goals: null,
            status: MatchStatus.SCHEDULED.value,
        });
    }

    static createInProgressMatch(props: { seed: number; awayTeam: Team; homeTeam: Team; goals: Array<{ dateOccured: Date; team: Team; player: Player }> }) {
        const date = new Date();
        return Mixins.createMatch({
            seed: props.seed,
            awayTeam: props.awayTeam,
            homeTeam: props.homeTeam,
            scheduledDate: date,
            startDate: date,
            endDate: null,
            goals: props.goals,
            status: MatchStatus.IN_PROGRESS.value,
        });
    }

    static createCompletedMatch(props: { seed: number; awayTeam: Team; homeTeam: Team; goals: Array<{ dateOccured: Date; team: Team; player: Player }> }) {
        const date = new Date();
        const endDate = DateTime.fromJSDate(date).plus({ minutes: 90 }).toJSDate();

        return Mixins.createMatch({
            seed: props.seed,
            awayTeam: props.awayTeam,
            homeTeam: props.homeTeam,
            scheduledDate: date,
            startDate: date,
            endDate: endDate,
            goals: props.goals,
            status: MatchStatus.COMPLETED.value,
        });
    }

    static createCancelledMatch(props: { seed: number; awayTeam: Team; homeTeam: Team }) {
        const date = new Date();

        return Mixins.createMatch({
            seed: props.seed,
            awayTeam: props.awayTeam,
            homeTeam: props.homeTeam,
            scheduledDate: date,
            startDate: null,
            endDate: null,
            goals: null,
            status: MatchStatus.CANCELLED.value,
        });
    }

    private static createMatch(props: {
        seed: number;
        scheduledDate: Date;
        status: string;
        awayTeam: Team;
        homeTeam: Team;
        startDate: Date | null;
        endDate: null | Date;
        goals: Array<{ dateOccured: Date; team: Team; player: Player }> | null;
    }) {
        const match = MatchFactory.CreateNew({
            id: `${props.seed}`,
            homeTeamId: props.homeTeam.id,
            awayTeamId: props.awayTeam.id,
            venue: `match_${props.seed}_venue`,
            matchDates: MatchDates.executeCreate({
                scheduledDate: props.scheduledDate,
                startDate: props.startDate,
                endDate: props.endDate,
            }),
            status: MatchStatus.executeCreate(props.status),
        });

        if (props.goals != null) {
            match.score = MatchScore.ZeroScore;
            props.goals.forEach((goal) => {
                match.executeAddGoal({ dateOccured: goal.dateOccured, team: goal.team, player: goal.player });
            });
        }

        return match;
    }
}

export default Mixins;
