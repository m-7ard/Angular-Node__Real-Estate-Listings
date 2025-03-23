import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';
import ApiModelMappers from '../../../../../mappers/ApiModelMappers';
import RealEstateListing from '../../../../../models/RealEstateListing';
import { RealEstateListingDataAccessService } from '../../../../../services/data-access/real-estate-listing-data-access.service';
import Client from '../../../../../models/Client';
import { ClientDataAccessService } from '../../../../../services/data-access/client-data-access.service';

export interface IUpdateRealEstateListingPageResolverData {
    listing: RealEstateListing;
    client: Client;
}

@Injectable({ providedIn: 'root' })
export class UpdateRealEstateListingPageResolver implements Resolve<IUpdateRealEstateListingPageResolverData> {
    constructor(private readonly realEstateListingDataAccess: RealEstateListingDataAccessService, private readonly clientDataAccess: ClientDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IUpdateRealEstateListingPageResolverData> {
        const id = route.paramMap.get('id');

        if (id == null) {
            throw new ClientSideErrorException('update-real-estate-listing-page.resolver: id parameter is null.');
        }
        
        return this.realEstateListingDataAccess.read(id).pipe(
            map(response => ApiModelMappers.realEstateListingApiModelToDomain(response.listing)),
            switchMap(listing => {
                if (!listing.clientId) {
                    throw new ClientSideErrorException('update-real-estate-listing-page.resolver: listing has no clientId.');
                }
    
                return this.clientDataAccess.read(listing.clientId).pipe(
                    map(clientResponse => ({
                        listing: listing,
                        client: ApiModelMappers.clientApiModelToDomain(clientResponse.client),
                    }))
                );
            })
        );
    }
}
