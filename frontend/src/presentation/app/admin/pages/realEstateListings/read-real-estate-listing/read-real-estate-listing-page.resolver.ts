import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import { RealEstateListingDataAccessService } from '../../../../../services/data-access/real-estate-listing-data-access.service';
import ApiModelMappers from '../../../../../mappers/ApiModelMappers';
import RealEstateListing from '../../../../../models/RealEstateListing';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';

export interface IReadRealEstateListingsPageResolverData {
    listing: RealEstateListing;
}

@Injectable({ providedIn: 'root' })
export class ReadRealEstateListingPageResolver implements Resolve<IReadRealEstateListingsPageResolverData> {
    constructor(private readonly realEstateListingDataAccess: RealEstateListingDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IReadRealEstateListingsPageResolverData> {
        const id = route.paramMap.get('id');

        if (id == null) {
            throw new ClientSideErrorException('read-real-estate-listings-page.resolver.ts: id parameter is null.');
        }
        
        const request = this.realEstateListingDataAccess.read(id).pipe(
            map((response) => {
                return ApiModelMappers.realEstateListingApiModelToDomain(response.listing);
            }),
        );

        return forkJoin({
            listing: request,
        });
    }
}
