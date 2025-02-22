import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, map, Observable } from 'rxjs';
import Team from '../../../models/Team';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import getRoutableException from '../../../utils/getRoutableException';
import TeamMapper from '../../../mappers/TeamMapper';

export interface IListTeamsResolverData {
    teams: Team[];
}

@Injectable({ providedIn: 'root' })
export class ListTeamsPageResolver implements Resolve<IListTeamsResolverData> {
    constructor(private _teamDataAccess: TeamDataAccessService) {}

    resolve(): Observable<IListTeamsResolverData> {
        return this._teamDataAccess
            .listTeams({
                name: null,
                limitBy: null,
                teamMembershipPlayerId: null,
            })
            .pipe(
                map((dto) => ({ teams: dto.teams.map(TeamMapper.apiModelToDomain) })),
                catchError((error) => {
                    throw getRoutableException(error);
                }),
            );
    }
}
