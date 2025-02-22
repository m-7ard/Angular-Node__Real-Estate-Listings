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

export interface ITeamMembershipLayoutPageResolverData {
    team: Team;
    teamPlayer: TeamPlayer;
}

@Injectable({ providedIn: 'root' })
export class TeamMembershipLayoutPageResolver implements Resolve<ITeamMembershipLayoutPageResolverData> {    
    constructor(private teamDataAccess: TeamDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ITeamMembershipLayoutPageResolverData> {
        let teamId = route.paramMap.get('teamId');
        if (teamId == null) {
            throw new ClientSideErrorException('Team Player Layout: teamId parameter is null.');
        }

        let teamMembershipId = route.paramMap.get('teamMembershipId');

        if (teamMembershipId == null) {
            throw new ClientSideErrorException('Team Player Layout: teamMembershipId parameter is null.');
        }
        const teamData = this.teamDataAccess.readTeamPlayer(teamId, teamMembershipId).pipe(
            map((response) => ({
                team: TeamMapper.apiModelToDomain(response.team),
                teamPlayer: TeamPlayerMapper.apiModelToDomain(response.teamPlayer),
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );

        return teamData;
    }
}
