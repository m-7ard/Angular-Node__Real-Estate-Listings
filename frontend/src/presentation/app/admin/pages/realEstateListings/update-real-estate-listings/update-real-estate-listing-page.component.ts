import { Component, OnInit } from '@angular/core';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { SelectOpt, SelectComponent } from '../../../../../reusables/widgets/select/select.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import IPresentationError from '../../../../../errors/IPresentationError';
import Client from '../../../../../models/Client';
import { ClientDataAccessService } from '../../../../../services/data-access/client-data-access.service';
import { ExceptionNoticeService } from '../../../../../services/exception-notice.service';
import { StaticApiDataService } from '../../../../../services/static-api-data-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormFieldComponent } from '../../../../../reusables/form-field/form-field.component';
import { FormErrorsComponent } from '../../../../../reusables/form-errors/form-errors';
import { CommonModule } from '@angular/common';
import { PageDirective } from '../../../../../reusables/page/page.directive';
import { PageSectionDirective } from '../../../../../reusables/page/page-section.directive';
import { ImageUploadComponent } from '../../../../../reusables/widgets/image-upload/image-upload.component';
import { CharFieldComponent } from '../../../../../reusables/widgets/char-field/char-field.component';
import { TextareaComponent } from '../../../../../reusables/widgets/textarea-field/textarea.component';
import { ClientSearchBoxComponent } from '../../../../../reusables/widgets/client-search-box/client-search-box.component';
import { RealEstateListingDataAccessService } from '../../../../../services/data-access/real-estate-listing-data-access.service';
import validateSuperstruct from '../../../../../utils/validateSuperstuct';
import { catchError, EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import PresentationErrorFactory from '../../../../../errors/PresentationErrorFactory';
import RealEstateListing from '../../../../../models/RealEstateListing';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';
import { IUpdateRealEstateListingPageResolverData } from './update-real-estate-listing-page.resolver';

interface IFormControls {
    bathroomNumber: FormControl<string>;
    bedroomNumber: FormControl<string>;
    city: FormControl<string>;
    client: FormControl<Client | null>;
    country: FormControl<string>;
    description: FormControl<string>;
    flooringType: FormControl<string>;
    images: FormControl<string[]>;
    price: FormControl<string>;
    squareMeters: FormControl<string>;
    state: FormControl<string>;
    street: FormControl<string>;
    title: FormControl<string>;
    type: FormControl<string>;
    yearBuilt: FormControl<string>;
    zip: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    city: string[];
    client: string[];
    country: string[];
    description: string[];
    images: string[];
    price: string[];
    state: string[];
    street: string[];
    type: string[];
    zip: string[];
    bathroomNumber: string[];
    bedroomNumber: string[];
    flooringType: string[];
    squareMeters: string[];
    title: string[];
    yearBuilt: string[];
}>;

@Component({
    selector: 'app-update-real-estate-listing-page',
    standalone: true,
    imports: [
        MixinStyledButtonDirective,
        FormFieldComponent,
        SelectComponent,
        FormErrorsComponent,
        CommonModule,
        ReactiveFormsModule,
        PageDirective,
        PageSectionDirective,
        ImageUploadComponent,
        CharFieldComponent,
        TextareaComponent,
        ClientSearchBoxComponent,
    ],
    templateUrl: './update-real-estate-listing-page.component.html',
})
export class UpdateRealEstateListingPageComponent implements OnInit {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};
    realEstateListingTypeOptions: Array<SelectOpt<string>>;
    ADDRESS_FIELDS: Array<keyof IFormControls> = ['street', 'city', 'zip', 'state', 'country'] as const;
    INFO_FIELDS: Array<keyof IFormControls> = [
        'bathroomNumber',
        'bedroomNumber',
        'flooringType',
        'yearBuilt',
        'squareMeters',
    ] as const;
    listing: RealEstateListing = null!;
    originalClient: Client = null!;

    private get initialData() {
        return {
            city: this.listing.city,
            client: this.originalClient,
            country: this.listing.country,
            description: this.listing.description,
            images: this.listing.images,
            price: this.listing.price.toString(),
            state: this.listing.state,
            street: this.listing.street,
            type: this.listing.type,
            zip: this.listing.zip,
            bathroomNumber: this.listing.bathroomNumber.toString(),
            bedroomNumber: this.listing.bedroomNumber.toString(),
            flooringType: this.listing.flooringType,
            squareMeters: this.listing.squareMeters.toString(),
            title: this.listing.title,
            yearBuilt: this.listing.yearBuilt.toString(),
        };
    }

    constructor(
        private readonly dataAccess: RealEstateListingDataAccessService,
        private readonly exceptionNoticeService: ExceptionNoticeService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        staticApiDataService: StaticApiDataService,
    ) {
        this.form = new FormGroup<IFormControls>({
            city: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            client: new FormControl(null, {
                validators: [Validators.required],
            }),
            country: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            description: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            price: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            state: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            street: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            type: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            zip: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            images: new FormControl([], {
                nonNullable: true,
                validators: [Validators.required],
            }),
            bathroomNumber: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            bedroomNumber: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            flooringType: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            squareMeters: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            title: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            yearBuilt: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

        this.realEstateListingTypeOptions = Object.entries(
            staticApiDataService.getOptions().realEstateListingTypes,
        ).map<SelectOpt<string>>(([value, label]) => ({ value: value, label: label }));
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IUpdateRealEstateListingPageResolverData;
            this.listing = data.listing;
            this.originalClient = data.client;
        });

        this.form.patchValue(this.initialData);
    }

    onReset(event: Event): void {
        event.preventDefault();
        this.form.reset(this.initialData);
    }

    onSubmit() {
        const rawValue = this.form.getRawValue();

        this.dataAccess
            .update(this.listing.id, {
                city: rawValue.city,
                clientId: rawValue.client?.id as string,
                country: rawValue.country,
                description: rawValue.description,
                images: rawValue.images,
                price: parseInt(rawValue.price),
                state: rawValue.state,
                street: rawValue.street,
                type: rawValue.type,
                zip: rawValue.zip,
                bathroomNumber: parseInt(rawValue.bathroomNumber),
                bedroomNumber: parseInt(rawValue.bedroomNumber),
                flooringType: rawValue.flooringType,
                squareMeters: parseInt(rawValue.squareMeters),
                title: rawValue.title,
                yearBuilt: parseInt(rawValue.yearBuilt),
            })
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    console.log(err.error)
            
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

                    this.router.navigate(['/admin/real-estate-listings']);
                },
            });
    }
}
