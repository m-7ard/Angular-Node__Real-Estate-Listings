import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
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

    resolve(): Observable<IFrontpageResolverData> {
        const request = this.realEstateListingDataAccess.list({}).pipe(
            map((response) => {
                return response.listings.map(ApiModelMappers.realEstateListingApiModelToDomain);
            }),
        );

        return forkJoin({
            listings: request,
        });
    }
}
