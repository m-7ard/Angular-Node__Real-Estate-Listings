import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';
import ApiModelMappers from '../../../../../mappers/ApiModelMappers';
import Client from '../../../../../models/Client';
import { ClientDataAccessService } from '../../../../../services/data-access/client-data-access.service';
import RealEstateListing from '../../../../../models/RealEstateListing';
import { RealEstateListingDataAccessService } from '../../../../../services/data-access/real-estate-listing-data-access.service';

export interface IDeleteClientsPageResolverData {
    clients: Client[];
    clientListings: {
        [clientId: Client['id']]: RealEstateListing[];
    };
}

@Injectable({ providedIn: 'root' })
export class DeleteClientsPageResolver implements Resolve<IDeleteClientsPageResolverData> {
    constructor(
        private readonly clientDataAccess: ClientDataAccessService,
        private readonly realEstateListingDataAccess: RealEstateListingDataAccessService,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IDeleteClientsPageResolverData> {
        const idsParam = route.queryParamMap.get('ids');
        if (!idsParam) {
            throw new ClientSideErrorException('delete-clients-page.resolver: ids parameter is null.');
        }

        const ids = idsParam.split(',');

        const clients$ = forkJoin(
            ids.map((id) =>
                this.clientDataAccess.read(id).pipe(map((dto) => ApiModelMappers.clientApiModelToDomain(dto.client))),
            ),
        );

        const clientListings$ = forkJoin(
            ids.map((id) =>
                this.realEstateListingDataAccess
                    .list({ clientId: id })
                    .pipe(
                        map((listings) => ({
                            [id]: listings.listings.map(ApiModelMappers.realEstateListingApiModelToDomain),
                        })),
                    ),
            ),
        ).pipe(
            map((results) => Object.assign({}, ...results)),
        );

        return forkJoin({ clients: clients$, clientListings: clientListings$ });
    }
}
