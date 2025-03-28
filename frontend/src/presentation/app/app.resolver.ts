import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { StaticDataResponseDTO } from '../contracts/other/static-data/StaticDataResponseDTO';
import { StaticApiDataService } from '../services/static-api-data-service';
import { SearchQueryService } from '../services/search-query-service';

export interface IAppResolverData {
    staticApiData: StaticDataResponseDTO | null;
}

@Injectable({ providedIn: 'root' })
export class AppResolver implements Resolve<IAppResolverData> {
    constructor(private readonly searchQueryService: SearchQueryService, private staticApiDataService: StaticApiDataService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IAppResolverData> {

        return forkJoin({
            staticApiData: this.staticApiDataService.loadData(),
        });
    }
}
