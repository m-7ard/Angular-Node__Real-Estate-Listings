import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { RealEsateListingComponent } from '../../../../reusables/models/real-estate-listing/real-estate-listing.component';
import { ListRealEstateListingsComponent } from "../../../../reusables/page-parts/list-real-estate-listings/list-real-estate-listings.component";
import { ListRealEstateListingsControlsComponent } from "../../../../reusables/page-parts/list-real-estate-listings-controls/list-real-estate-listings-controls.component";

@Component({
    selector: 'app-real-estate-listings-page',
    standalone: true,
    imports: [MixinStyledButtonDirective, RealEsateListingComponent, ListRealEstateListingsComponent, ListRealEstateListingsControlsComponent],
    templateUrl: './real-estate-listings-page.component.html',
})
export class ListRealEstateListingsPageComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {}
}
