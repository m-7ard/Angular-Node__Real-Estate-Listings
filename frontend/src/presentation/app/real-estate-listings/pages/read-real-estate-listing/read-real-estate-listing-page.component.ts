import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageDirective } from '../../../../reusables/page/page.directive';
import { PageSectionDirective } from '../../../../reusables/page/page-section.directive';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import RealEstateListing from '../../../../models/RealEstateListing';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import { IReadRealEstateListingsPageResolverData } from './read-real-estate-listing-page.resolver';
import { StaticApiDataService } from '../../../../services/static-api-data-service';
import { GenerateLabelPipe } from '../../../../pipes/generate-label.pipe';
import { AuthService } from '../../../../services/auth-service';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirective } from '../../../../reusables/styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../../../../reusables/styled-card/styled-card-section.directive';
import { FormFieldComponent } from '../../../../reusables/form-field/form-field.component';
import { CharFieldComponent } from '../../../../reusables/widgets/char-field/char-field.component';
import { TextareaComponent } from '../../../../reusables/widgets/textarea-field/textarea.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-read-real-estate-listing-page',
    standalone: true,
    imports: [
        CommonModule,
        PageDirective,
        PageSectionDirective,
        CoverImageComponent,
        GenerateLabelPipe,
        MixinStyledButtonDirective,
        MixinStyledCardDirective,
        MixinStyledCardSectionDirective,
        FormFieldComponent,
        CharFieldComponent,
        TextareaComponent,
        ReactiveFormsModule,
        RouterModule,
    ],
    templateUrl: './read-real-estate-listing-page.component.html',
})
export class ReadRealEstateListingPageComponent implements OnInit {
    listing: RealEstateListing = null!;
    LEFT_PROPERTIES: Array<keyof RealEstateListing> = ['street', 'city', 'zip', 'state', 'country'] as const;
    RIGHT_PROPERTIES: Array<keyof RealEstateListing> = [
        'bathroomNumber',
        'bedroomNumber',
        'flooringType',
        'yearBuilt',
        'squareMeters',
    ] as const;
    listingTypes: Record<string, string> = null!;
    isAdmin: boolean = null!;
    images: Array<string | undefined> = null!;

    constructor(
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        staticDataService: StaticApiDataService,
        authService: AuthService,
    ) {
        this.listingTypes = staticDataService.getOptions().realEstateListingTypes;
        const currentUser = authService.getCurrentUser();
        this.isAdmin = currentUser != null && currentUser.isAdmin;
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IReadRealEstateListingsPageResolverData;
            this.listing = data.listing;
            this.images = this.listing.images;
        });
    }
}
