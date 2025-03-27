import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import Client from '../../../../../models/Client';
import { ClientDataAccessService } from '../../../../../services/data-access/client-data-access.service';
import ApiModelMappers from '../../../../../mappers/ApiModelMappers';

export interface IClientsPageResolverData {
    clients: Client[];
}

@Injectable({ providedIn: 'root' })
export class ClientsPageResolver implements Resolve<IClientsPageResolverData> {
    constructor(private readonly clientDataAccess: ClientDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IClientsPageResolverData> {
        const queryParams = { ...route.queryParams };
        Object.keys(queryParams).forEach((key) => {
            if (queryParams[key] === '') {
                queryParams[key] = undefined;
            }
        });

        const request = this.clientDataAccess.list(queryParams).pipe(
            map((response) => {
                return response.clients.map(ApiModelMappers.clientApiModelToDomain);
            }),
        );

        return forkJoin({
            clients: request,
        });
    }
}
