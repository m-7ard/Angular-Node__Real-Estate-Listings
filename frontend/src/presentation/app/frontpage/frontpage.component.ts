import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListRealEstateListingsControlsComponent } from '../../reusables/page-parts/list-real-estate-listings-controls/list-real-estate-listings-controls.component';
import { ListRealEstateListingsComponent } from '../../reusables/page-parts/list-real-estate-listings/list-real-estate-listings.component';
import RealEstateListing from '../../models/RealEstateListing';
import { RESOLVER_DATA_KEY } from '../../utils/RESOLVER_DATA';
import { IFrontpageResolverData } from './frontpage.resolver';
import { SearchQueryService } from '../../services/search-query-service';

@Component({
    selector: 'app-frontpage',
    standalone: true,
    imports: [ListRealEstateListingsComponent, ListRealEstateListingsControlsComponent],
    templateUrl: './frontpage.component.html',
})
export class FrontpageComponent implements OnInit {
    public listings: RealEstateListing[] = null!;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        public readonly searchQueryService: SearchQueryService,
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IFrontpageResolverData;
            this.listings = data.listings;
        });
    }
}
