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
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import IPresentationError from '../../../../errors/IPresentationError';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SendEmailRequestDTO } from '../../../../contracts/other/send-email/SendEmailRequestDTO';
import { environment } from '../../../../environments/environment';
import { SendEmailResponseDTO } from '../../../../contracts/other/send-email/SendEmailResponseDTO';
import { ExceptionNoticeService } from '../../../../services/exception-notice.service';
import { catchError, EMPTY } from 'rxjs';
import PresentationErrorFactory from '../../../../errors/PresentationErrorFactory';

interface IFormControls {
    email: FormControl<string>;
    inquiry: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    email: string[];
    inquiry: string[];
}>;

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
    private readonly baseUrl = `${environment.apiUrl}/api`;
    confirmation: boolean = false;

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
    mailingForm: FormGroup<IFormControls>;
    errors: IErrorSchema = {};

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly http: HttpClient,
        private readonly exceptionNoticeService: ExceptionNoticeService,
        staticDataService: StaticApiDataService,
        authService: AuthService,
    ) {
        this.mailingForm = new FormGroup<IFormControls>({
            email: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            inquiry: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

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

    sendEmail() {
        this.confirmation = false;
        const rawValue = this.mailingForm.getRawValue();
        const request: SendEmailRequestDTO = {
            email: rawValue.email,
            inquiry: rawValue.inquiry,
            realEstateListingId: this.listing.id,
        };
        const response = this.http.post<SendEmailResponseDTO>(`${this.baseUrl}/send-email`, request);
        response
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 400) {
                        this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
                    } else {
                        this.exceptionNoticeService.dispatchError(new Error(JSON.stringify(err.message)));
                    }

                    return EMPTY;
                }),
            )
            .subscribe({
                next: (response) => {
                    if (response === null) {
                        return;
                    }

                    this.confirmation = true;
                },
            });
    }
}
