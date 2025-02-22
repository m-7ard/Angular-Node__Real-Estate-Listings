import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import Team from '../../../../models/Team';
import TeamMapper from '../../../../mappers/TeamMapper';
import { TeamDataAccessService } from '../../../../services/data-access/team-data-access.service';
import TeamPlayer from '../../../../models/TeamPlayer';
import TeamPlayerMapper from '../../../../mappers/TeamPlayerMapper';
import getRoutableException from '../../../../utils/getRoutableException';
import ClientSideErrorException from '../../../../exceptions/ClientSideErrorException';

export interface IUpdateTeamMembershipResolverData {
    team: Team;
    teamPlayer: TeamPlayer;
}

@Injectable({ providedIn: 'root' })
export class UpdateTeamMembershipPageResolver implements Resolve<IUpdateTeamMembershipResolverData> {
    constructor(private _teamDataAccess: TeamDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IUpdateTeamMembershipResolverData> {
        let teamId = route.parent!.paramMap.get('teamId');

        if (teamId == null) {
            throw new ClientSideErrorException('Update Team Page: teamId param is null.');
        }

        const teamMembershipId = route.parent?.paramMap.get('teamMembershipId');
        if (teamMembershipId == null) {
            throw new ClientSideErrorException('Update Team Membership Page: teamMembershipId param is null.');
        }

        return this._teamDataAccess.readTeamPlayer(teamId, teamMembershipId).pipe(
            map((response) => ({
                team: TeamMapper.apiModelToDomain(response.team),
                teamPlayer: TeamPlayerMapper.apiModelToDomain(response.teamPlayer),
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );
    }
}
