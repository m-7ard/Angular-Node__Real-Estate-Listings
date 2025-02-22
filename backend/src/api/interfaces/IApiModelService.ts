import IMatchApiModel from "@apiModels/IMatchApiModel";
import IMatchEventApiModel from "@apiModels/IMatchEventApiModel";
import IMatchParticipantsApiModel from "@apiModels/IMatchParticipantsApiModel";
import ITeamPlayerApiModel from "@apiModels/ITeamPlayerApiModel";
import Match from "domain/entities/Match";
import MatchEvent from "domain/entities/MatchEvent";
import TeamMembership from "domain/entities/TeamMembership";

interface IApiModelService {
    createMatchApiModel(match: Match): Promise<IMatchApiModel>;
    createManyMatchApiModels(matches: Match[]): Promise<IMatchApiModel[]>;
    createMatchEventApiModel(matchEvent: MatchEvent): Promise<IMatchEventApiModel>;
    createManyMatchEventApiModel(matchEvents: MatchEvent[]): Promise<IMatchEventApiModel[]>;
    createTeamPlayerApiModel(teamMembership: TeamMembership): Promise<ITeamPlayerApiModel>;
    createManyTeamPlayerApiModel(teamMemberships: Array<TeamMembership>): Promise<ITeamPlayerApiModel[]>;
    createMatchParticipantsApiModel(match: Match): Promise<IMatchParticipantsApiModel>;
}

export default IApiModelService;
