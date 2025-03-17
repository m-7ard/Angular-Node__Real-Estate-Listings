import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import Client from '../../../../models/Client';
import { ClientDataAccessService } from '../../../../services/data-access/client-data-access.service';
import ApiModelMappers from '../../../../mappers/ApiModelMappers';

export interface IClientsPageResolverData {
    clients: Client[];
}

@Injectable({ providedIn: 'root' })
export class ClientsPageResolver implements Resolve<IClientsPageResolverData> {
    constructor(private readonly clientDataAccess: ClientDataAccessService) {}

    resolve(): Observable<IClientsPageResolverData> {
        const request = this.clientDataAccess.list({}).pipe(
            map((response) => {
                return response.clients.map(ApiModelMappers.clientApiModelToDomain);
            }),
        );

        return forkJoin({
            clients: request,
        });
    }
}
