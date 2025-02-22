import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import ClientSideErrorException from '../../../../exceptions/ClientSideErrorException';
import getRoutableException from '../../../../utils/getRoutableException';
import TeamMembershipHistory from '../../../../models/TeamMembershipHistory';
import { TeamDataAccessService } from '../../../../services/data-access/team-data-access.service';
import TeamMembershipHistoryMapper from '../../../../mappers/TeamMembershipHistoryMapper';
import TeamMembership from '../../../../models/TeamMembership';
import TeamMembershipMapper from '../../../../mappers/MembershipMapper';

export interface ITeamMembershipHistoriesPageResolverData {
    teamMembershipHistories: TeamMembershipHistory[];
    teamMembership: TeamMembership;
}

@Injectable({ providedIn: 'root' })
export class TeamMembershipHistoriesPageResolver implements Resolve<ITeamMembershipHistoriesPageResolverData> {
    constructor(private teamDataAccess: TeamDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ITeamMembershipHistoriesPageResolverData> {
        let teamId = route.parent?.paramMap.get('teamId');

        if (teamId == null) {
            throw new ClientSideErrorException('Team Membership Histories Page: teamId parameter is null.');
        }

        let teamMembershipId = route.parent?.paramMap.get('teamMembershipId');

        if (teamMembershipId == null) {
            throw new ClientSideErrorException('Team Membership Histories Page: teamMembershipId parameter is null.');
        }

        return this.teamDataAccess.listTeamMembershipHistories(teamId, teamMembershipId, {}).pipe(
            map((response) => ({
                teamMembershipHistories: response.teamMembershipHistories.map(
                    TeamMembershipHistoryMapper.apiModelToDomain,
                ),
                teamMembership: TeamMembershipMapper.apiModelToDomain(response.teamPlayer.membership)
            })),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );
    }
}
