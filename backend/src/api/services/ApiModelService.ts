import IApiModelService from "api/interfaces/IApiModelService";
import ApiModelMapper from "api/mappers/ApiModelMapper";
import ITeamRepository from "application/interfaces/ITeamRepository";
import Match from "domain/entities/Match";
import Team from "domain/entities/Team";
import TeamId from "domain/valueObjects/Team/TeamId";

class ApiModelService implements IApiModelService {
    private readonly teamCache = new Map<Team["id"], Team | null>();

    constructor(
        private readonly teamRepository: ITeamRepository,
    ) {}

    private async getTeamFromCacheOrDb(teamId: TeamId): Promise<Team | null> {
        if (this.teamCache.has(teamId)) {
            return this.teamCache.get(teamId)!;
        }

        const team = await this.teamRepository.getByIdAsync(teamId);
        this.teamCache.set(teamId, team);
        return team;
    }

    async createMatchApiModel(match: Match): Promise<IMatchApiModel> {
        const homeTeam = await this.getTeamFromCacheOrDb(match.homeTeamId);
        if (homeTeam == null) throw new Error("Home Team does not exist.");

        const awayTeam = await this.getTeamFromCacheOrDb(match.awayTeamId);
        if (awayTeam == null) throw new Error("Away Team does not exist.");

        return ApiModelMapper.createMatchApiModel({
            match: match,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
        });
    }
}

export default ApiModelService;
