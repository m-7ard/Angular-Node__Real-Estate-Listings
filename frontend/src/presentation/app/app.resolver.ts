import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { StaticDataResponseDTO } from '../contracts/other/static-data/StaticDataResponseDTO';
import { StaticApiDataService } from '../services/static-api-data-service';

export interface IAppResolverData {
    staticApiData: StaticDataResponseDTO | null;
}

@Injectable({ providedIn: 'root' })
export class AppResolver implements Resolve<IAppResolverData> {
    constructor(private staticApiDataService: StaticApiDataService) {}

    resolve(): Observable<IAppResolverData> {
        return forkJoin({
            staticApiData: this.staticApiDataService.loadData(),
        });
    }
}
