import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import ClientSideErrorException from '../../../../../exceptions/ClientSideErrorException';
import ApiModelMappers from '../../../../../mappers/ApiModelMappers';
import RealEstateListing from '../../../../../models/RealEstateListing';
import { RealEstateListingDataAccessService } from '../../../../../services/data-access/real-estate-listing-data-access.service';

export interface IDeleteRealEstateListingsPageResolverData {
    listings: RealEstateListing[];
}

@Injectable({ providedIn: 'root' })
export class DeleteRealEstateListingsPageResolver implements Resolve<IDeleteRealEstateListingsPageResolverData> {
    constructor(private readonly realEstateListingDataAccess: RealEstateListingDataAccessService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<IDeleteRealEstateListingsPageResolverData> {
        const idsParam = route.queryParamMap.get('ids');

        if (idsParam == null) {
            throw new ClientSideErrorException('delete-real-estate-listing-page: ids parameter is null.');
        }

        const ids = idsParam.split(',');

        const requests = ids.map((id) =>
            this.realEstateListingDataAccess
                .read(id)
                .pipe(map((response) => ApiModelMappers.realEstateListingApiModelToDomain(response.listing))),
        );

        return forkJoin(requests).pipe(map((listings) => ({ listings })));
    }
}
