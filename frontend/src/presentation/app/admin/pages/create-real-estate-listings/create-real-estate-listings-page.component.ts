import { Component, OnInit } from '@angular/core';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { SelectOpt, SelectComponent } from '../../../../reusables/widgets/select/select.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import IPresentationError from '../../../../errors/IPresentationError';
import Client from '../../../../models/Client';
import { ClientDataAccessService } from '../../../../services/data-access/client-data-access.service';
import { ExceptionNoticeService } from '../../../../services/exception-notice.service';
import { StaticApiDataService } from '../../../../services/static-api-data-service';
import { Router } from '@angular/router';
import { FormFieldComponent } from '../../../../reusables/form-field/form-field.component';
import { FormErrorsComponent } from '../../../../reusables/form-errors/form-errors';
import { CommonModule } from '@angular/common';
import { PageDirective } from '../../../../reusables/page/page.directive';
import { PageSectionDirective } from '../../../../reusables/page/page-section.directive';
import { ImageUploadComponent } from '../../../../reusables/widgets/image-upload/image-upload.component';
import { CharFieldComponent } from '../../../../reusables/widgets/char-field/char-field.component';
import { DividerComponent } from "../../../../reusables/divider/divider.component";

interface IFormControls {
    city: FormControl<string>;
    client: FormControl<Client | null>;
    country: FormControl<string>;
    dateCreated: FormControl<string>;
    price: FormControl<string>;
    state: FormControl<string>;
    street: FormControl<string>;
    type: FormControl<string>;
    zip: FormControl<string>;
    images: FormControl<string[]>;
}

type IErrorSchema = IPresentationError<{
    city: string[];
    client: string[];
    country: string[];
    dateCreated: string[];
    price: string[];
    state: string[];
    street: string[];
    type: string[];
    zip: string[];
    images: string[];
}>;

@Component({
    selector: 'app-create-real-estate-listings-page',
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
    DividerComponent
],
    templateUrl: './create-real-estate-listings-page.component.html',
})
export class CreateRealEstateListingsPageComponent implements OnInit {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};
    realEstateListingTypeOptions: Array<SelectOpt<string>>;
    ADDRESS_FIELDS: Array<keyof IFormControls> = ["street", "city", "zip", "state", "country"] as const;

    constructor(
        private readonly dataAccess: ClientDataAccessService,
        private readonly exceptionNoticeService: ExceptionNoticeService,
        private readonly router: Router,
        private readonly staticApiDataService: StaticApiDataService,
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
            dateCreated: new FormControl('', {
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
        });

        this.realEstateListingTypeOptions = Object.entries(
            staticApiDataService.getOptions().realEstateListingTypes,
        ).map<SelectOpt<string>>(([value, label]) => ({ value: value, label: label }));
    }

    ngOnInit() {}

    onSubmit() {}
    onReset() {}
}
