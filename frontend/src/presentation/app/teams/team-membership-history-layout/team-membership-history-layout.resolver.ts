import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import getRoutableException from '../../../utils/getRoutableException';
import ClientSideErrorException from '../../../exceptions/ClientSideErrorException';
import TeamMembershipHistory from '../../../models/TeamMembershipHistory';
import TeamMembershipHistoryMapper from '../../../mappers/TeamMembershipHistoryMapper';
import Team from '../../../models/Team';
import TeamMapper from '../../../mappers/TeamMapper';
import TeamPlayerMapper from '../../../mappers/TeamPlayerMapper';
import TeamPlayer from '../../../models/TeamPlayer';

export interface ITeamMembershipHistoryLayoutResolverData {
    team: Team;
    teamPlayer: TeamPlayer;
    teamMembershipHistory: TeamMembershipHistory;
}

@Injectable({ providedIn: 'root' })
export class TeamMembershipHistoryLayoutResolver implements Resolve<ITeamMembershipHistoryLayoutResolverData> {
    constructor(private teamDataAccess: TeamDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ITeamMembershipHistoryLayoutResolverData> {
        let teamId = route.paramMap.get('teamId');
        if (teamId == null) {
            throw new ClientSideErrorException('Team Player Layout: teamId parameter is null.');
        }

        let teamMembershipId = route.paramMap.get('teamMembershipId');

        if (teamMembershipId == null) {
            throw new ClientSideErrorException('Team Player Layout: teamMembershipId parameter is null.');
        }

        let teamMembershipHistoryId = route.paramMap.get('teamMembershipHistoryId');

        if (teamMembershipHistoryId == null) {
            throw new ClientSideErrorException('Team Player Layout: teamMembershipHistoryId parameter is null.');
        }

        const teamData = this.teamDataAccess.listTeamMembershipHistories(teamId, teamMembershipId, {}).pipe(
            map((response) => {
                const teamMembershipHistory = response.teamMembershipHistories.find(
                    (history) => history.id === teamMembershipHistoryId,
                );

                if (teamMembershipHistory == null) {
                    throw new ClientSideErrorException(
                        `TeamMembershipHistory of id "${teamMembershipHistoryId}" does not exist in the repsonse.`,
                    );
                }

                return {
                    team: TeamMapper.apiModelToDomain(response.team),
                    teamPlayer: TeamPlayerMapper.apiModelToDomain(response.teamPlayer),
                    teamMembershipHistory: TeamMembershipHistoryMapper.apiModelToDomain(teamMembershipHistory),
                };
            }),
            catchError((error) => {
                throw getRoutableException(error);
            }),
        );

        return teamData;
    }
}
