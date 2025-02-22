import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import Team from '../../../models/Team';
import TeamMapper from '../../../mappers/TeamMapper';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import TeamPlayer from '../../../models/TeamPlayer';
import TeamPlayerMapper from '../../../mappers/TeamPlayerMapper';
import getRoutableException from '../../../utils/getRoutableException';
import ClientSideErrorException from '../../../exceptions/ClientSideErrorException';
import { MatchDataAccessService } from '../../../services/data-access/match-data-access.service';

export interface ITeamLayoutPageResolverData {
    team: Team;
    teamPlayers: TeamPlayer[];
}

@Injectable({ providedIn: 'root' })
export class TeamLayoutPageResolver implements Resolve<ITeamLayoutPageResolverData> {
    constructor(
        private teamDataAccess: TeamDataAccessService,
        private matchDataAccess: MatchDataAccessService,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ITeamLayoutPageResolverData> {
        let teamId = route.paramMap.get('teamId');

        if (teamId == null) {
            throw new ClientSideErrorException('Read Team Page: teamId parameter is null.');
        }

        const teamData = this.teamDataAccess.readTeam(teamId).pipe(
            map((response) => ({
                team: TeamMapper.apiModelToDomain(response.team),
                teamPlayers: response.teamPlayers.map(TeamPlayerMapper.apiModelToDomain),
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );

        return teamData;
    }
}
