import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';

export interface IListRealEstateListingsPageResolverData {
}

@Injectable({ providedIn: 'root' })
export class ListRealEstateListingsPageResolver implements Resolve<IListRealEstateListingsPageResolverData> {
    constructor(
        // private readonly matchDataAccess: MatchDataAccessService,
    ) {}

    resolve(): Observable<IListRealEstateListingsPageResolverData> {
        // const matchesRequest = this.matchDataAccess
        //     .listMatches({ limitBy: 24, status: null, scheduledDate: new Date(), teamId: null })
        //     .pipe(
        //         map((response) => {
        //             return response.matches.map(MatchMapper.apiModelToDomain);
        //         }),
        //     );

        return forkJoin({
            // players: playersRequest,
            // teams: teamsRequest,
            // matches: matchesRequest,
        });
    }
}
