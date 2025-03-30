import { Routes } from '@angular/router';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { ReadRealEstateListingPageComponent } from './real-estate-listings/pages/read-real-estate-listing/read-real-estate-listing-page.component';
import { ReadRealEstateListingPageResolver } from './real-estate-listings/pages/read-real-estate-listing/read-real-estate-listing-page.resolver';

export const realEstateListingsRoutes: Routes = [
    {
        path: 'real-estate-listings',
        children: [
            {
                path: ':id',
                component: ReadRealEstateListingPageComponent,
                resolve: { [RESOLVER_DATA_KEY]: ReadRealEstateListingPageResolver },
            },
        ],
    },
];
