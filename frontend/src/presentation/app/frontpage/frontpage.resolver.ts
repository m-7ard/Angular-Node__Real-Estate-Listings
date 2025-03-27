import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import ApiModelMappers from '../../mappers/ApiModelMappers';
import RealEstateListing from '../../models/RealEstateListing';
import { RealEstateListingDataAccessService } from '../../services/data-access/real-estate-listing-data-access.service';

export interface IFrontpageResolverData {
    listings: RealEstateListing[];
}

@Injectable({ providedIn: 'root' })
export class FrontpageResolver implements Resolve<IFrontpageResolverData> {
    constructor(private readonly realEstateListingDataAccess: RealEstateListingDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IFrontpageResolverData> {
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
