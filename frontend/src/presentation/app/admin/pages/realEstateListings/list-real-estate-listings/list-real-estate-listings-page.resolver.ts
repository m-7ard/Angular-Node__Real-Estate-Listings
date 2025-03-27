import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import { RealEstateListingDataAccessService } from '../../../../../services/data-access/real-estate-listing-data-access.service';
import ApiModelMappers from '../../../../../mappers/ApiModelMappers';
import RealEstateListing from '../../../../../models/RealEstateListing';

export interface IListRealEstateListingsPageResolverData {
    listings: RealEstateListing[];
}

@Injectable({ providedIn: 'root' })
export class ListRealEstateListingsPageResolver implements Resolve<IListRealEstateListingsPageResolverData> {
    constructor(private readonly realEstateListingDataAccess: RealEstateListingDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IListRealEstateListingsPageResolverData> {
        const queryParams = { ...route.queryParams };
        Object.keys(queryParams).forEach((key) => {
            if (queryParams[key] === '') {
                queryParams[key] = undefined;
            }
        });

        const request = this.realEstateListingDataAccess.list(queryParams).pipe(
            map((response) => {
                return response.listings.map(ApiModelMappers.realEstateListingApiModelToDomain);
            }),
        );

        return forkJoin({
            listings: request,
        });
    }
}
