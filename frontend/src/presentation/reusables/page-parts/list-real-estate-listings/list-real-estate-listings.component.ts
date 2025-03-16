import { Component, OnInit } from '@angular/core';
import { RealEsateListingComponent } from '../../models/real-estate-listing/real-estate-listing.component';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';

@Component({
    selector: 'app-list-real-estate-listings',
    standalone: true,
    imports: [MixinStyledButtonDirective, RealEsateListingComponent],
    templateUrl: './list-real-estate-listings.component.html',
})
export class ListRealEstateListingsComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
