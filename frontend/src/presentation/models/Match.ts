import MatchStatus from '../values/MatchStatus';
import Team from './Team';

type MatchProps = {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    venue: string;
    scheduledDate: Date;
    startDate: Date | null;
    endDate: Date | null;
    status: MatchStatus;
    score: {
        homeTeamScore: number;
        awayTeamScore: number;
    } | null;
};

class Match implements MatchProps {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    venue: string;
    scheduledDate: Date;
    startDate: Date | null;
    endDate: Date | null;
    status: MatchStatus;
    score: { homeTeamScore: number; awayTeamScore: number } | null;

    constructor(props: MatchProps) {
        this.id = props.id;
        this.homeTeam = props.homeTeam;
        this.awayTeam = props.awayTeam;
        this.venue = props.venue;
        this.scheduledDate = props.scheduledDate;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.status = props.status;
        this.score = props.score;
    }

    get statusLabel() {
        return this.status.label;
    }

    get statusColor() {
        return this.status.colors;
    }

    canTransition(status: MatchStatus) {
        return this.status.canTransition(status);
    }

    canScore() {
        this.status.isScorable;
    }

    getStatusDate() {
        if (this.status === MatchStatus.SCHEDULED) {
            return this.scheduledDate;
        } else if (this.status === MatchStatus.IN_PROGRESS) {
            return this.startDate;
        } else if (this.status === MatchStatus.COMPLETED) {
            return this.endDate;
        }

        return null;
    }
}

export default Match;
