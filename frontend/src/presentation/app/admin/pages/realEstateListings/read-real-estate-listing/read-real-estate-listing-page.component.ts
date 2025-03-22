import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageDirective } from '../../../../../reusables/page/page.directive';
import { PageSectionDirective } from '../../../../../reusables/page/page-section.directive';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';
import RealEstateListing from '../../../../../models/RealEstateListing';
import { CoverImageComponent } from '../../../../../reusables/cover-image/cover-image.component';
import { IReadRealEstateListingsPageResolverData } from './read-real-estate-listing-page.resolver';
import { DividerComponent } from "../../../../../reusables/divider/divider.component";
import { StaticApiDataService } from '../../../../../services/static-api-data-service';
import { GenerateLabelPipe } from '../../../../../pipes/generate-label.pipe';

@Component({
    selector: 'app-read-real-estate-listing-page',
    standalone: true,
    imports: [CommonModule, PageDirective, PageSectionDirective, CoverImageComponent, GenerateLabelPipe],
    templateUrl: './read-real-estate-listing-page.component.html',
})
export class ReadRealEstateListingPageComponent implements OnInit {
    listing: RealEstateListing = null!;
    LEFT_PROPERTIES: Array<keyof RealEstateListing> = ['street', 'city', 'zip', 'state', 'country'] as const;
    RIGHT_PROPERTIES: Array<keyof RealEstateListing> = ['bathroomNumber', 'bedroomNumber', 'flooringType', 'yearBuilt', 'squareMeters'] as const;
    listingTypes: Record<string, string> = null!;

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly staticDataService: StaticApiDataService
    ) {
        this.listingTypes = staticDataService.getOptions().realEstateListingTypes;
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IReadRealEstateListingsPageResolverData;
            this.listing = data.listing;
        });
    }
}
