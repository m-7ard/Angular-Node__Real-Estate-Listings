import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import Player from '../../models/Player';
import Team from '../../models/Team';
import { PlayerDataAccessService } from '../../services/data-access/player-data-access.service';
import PlayerMapper from '../../mappers/PlayerMapper';
import { TeamDataAccessService } from '../../services/data-access/team-data-access.service';
import TeamMapper from '../../mappers/TeamMapper';
import Match from '../../models/Match';
import { MatchDataAccessService } from '../../services/data-access/match-data-access.service';
import MatchMapper from '../../mappers/MatchMapper';

export interface IFrontpageResolverData {
    players: Player[];
    teams: Team[];
    matches: Match[];
}

@Injectable({ providedIn: 'root' })
export class FrontpageResolver implements Resolve<IFrontpageResolverData> {
    constructor(
        private readonly playerDataAccess: PlayerDataAccessService,
        private readonly teamDataAccess: TeamDataAccessService,
        private readonly matchDataAccess: MatchDataAccessService,
    ) {}

    resolve(): Observable<IFrontpageResolverData> {
        const playersRequest = this.playerDataAccess.listPlayers({ name: null, limitBy: null }).pipe(
            map((response) => {
                return response.players.map(PlayerMapper.apiModelToDomain);
            }),
        );

        const teamsRequest = this.teamDataAccess
            .listTeams({ name: null, limitBy: 5, teamMembershipPlayerId: null })
            .pipe(
                map((response) => {
                    return response.teams.map(TeamMapper.apiModelToDomain);
                }),
            );

        const matchesRequest = this.matchDataAccess
            .listMatches({ limitBy: 24, status: null, scheduledDate: new Date(), teamId: null })
            .pipe(
                map((response) => {
                    return response.matches.map(MatchMapper.apiModelToDomain);
                }),
            );

        return forkJoin({
            players: playersRequest,
            teams: teamsRequest,
            matches: matchesRequest,
        });
    }
}
