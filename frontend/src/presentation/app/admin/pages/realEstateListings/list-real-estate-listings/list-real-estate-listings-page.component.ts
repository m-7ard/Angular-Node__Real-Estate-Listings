import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListRealEstateListingsComponent } from '../../../../../reusables/page-parts/list-real-estate-listings/list-real-estate-listings.component';
import { ListRealEstateListingsControlsComponent } from '../../../../../reusables/page-parts/list-real-estate-listings-controls/list-real-estate-listings-controls.component';
import RealEstateListing from '../../../../../models/RealEstateListing';
import { IListRealEstateListingsPageResolverData } from './list-real-estate-listings-page.resolver';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';

@Component({
    selector: 'app-list-real-estate-listings-page',
    standalone: true,
    imports: [ListRealEstateListingsComponent, ListRealEstateListingsControlsComponent],
    templateUrl: './list-real-estate-listings-page.component.html',
})
export class ListRealEstateListingsPageComponent implements OnInit {
    public listings: RealEstateListing[] = null!;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IListRealEstateListingsPageResolverData;
            this.listings = data.listings;
        });
    }
}
