import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, Observable } from 'rxjs';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';
import ApiModelMappers from '../../../../../mappers/ApiModelMappers';
import Client from '../../../../../models/Client';
import { ClientDataAccessService } from '../../../../../services/data-access/client-data-access.service';

export interface IUpdateClientPageResolverData {
    client: Client;
}

@Injectable({ providedIn: 'root' })
export class UpdateClientPageResolver implements Resolve<IUpdateClientPageResolverData> {
    constructor(
        private readonly clientDataAccess: ClientDataAccessService,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IUpdateClientPageResolverData> {
        const id = route.paramMap.get('id');

        if (id == null) {
            throw new ClientSideErrorException('update-real-estate-listing-page.resolver: id parameter is null.');
        }

        return this.clientDataAccess.read(id).pipe(
            map((clientResponse) => ({
                client: ApiModelMappers.clientApiModelToDomain(clientResponse.client),
            })),
        );
    }
}
