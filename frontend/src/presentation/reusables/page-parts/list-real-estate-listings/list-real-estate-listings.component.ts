import { Component, Input, OnInit } from '@angular/core';
import { RealEsateListingComponent } from '../../models/real-estate-listing/real-estate-listing.component';
import RealEstateListing from '../../../models/RealEstateListing';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-list-real-estate-listings',
    standalone: true,
    imports: [RealEsateListingComponent, CommonModule],
    templateUrl: './list-real-estate-listings.component.html',
})
export class ListRealEstateListingsComponent implements OnInit {
    @Input() listings: RealEstateListing[] = null!;

    constructor() {}

    ngOnInit() {}
}
