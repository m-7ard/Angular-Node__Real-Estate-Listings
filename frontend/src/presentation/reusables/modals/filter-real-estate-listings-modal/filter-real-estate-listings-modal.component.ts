import { Component, Inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';
import { DividerComponent } from '../../divider/divider.component';
import { PanelDirective } from '../../panel/panel.directive';
import { PanelSectionDirective } from '../../panel/panel-section.directive';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { CharFieldComponent } from '../../widgets/char-field/char-field.component';
import { SelectComponent, SelectOpt } from '../../widgets/select/select.component';
import { StaticApiDataService } from '../../../services/static-api-data-service';
import { IFilterRealEstateListingsFormControls } from '../../page-parts/list-real-estate-listings-controls/list-real-estate-listings-controls.component';

export interface IFilterRealEstateListingsModalProps {
    form: FormGroup<IFilterRealEstateListingsFormControls>;
    onSubmit: (form: FormGroup<IFilterRealEstateListingsFormControls>) => void;
}

@Component({
    selector: 'app-filter-real-estate-listings-modal',
    standalone: true,
    imports: [
        CommonModule,
        PanelDirective,
        PanelSectionDirective,
        MixinStyledButtonDirective,
        DividerComponent,
        ReactiveFormsModule,
        FormFieldComponent,
        CharFieldComponent,
        SelectComponent,
    ],
    templateUrl: './filter-real-estate-listings-modal.component.html',
})
export class FilterRealEstateListingsModal {
    public form: FormGroup<IFilterRealEstateListingsFormControls> = null!;
    public onSubmitCallback: (form: FormGroup<IFilterRealEstateListingsFormControls>) => void = null!;
    realEstateListingTypeOptions: Array<SelectOpt<string>>;

    public TEXT_FIELDS: Array<keyof IFilterRealEstateListingsFormControls> = [
        'bathroomNumber',
        'bedroomNumber',
        'city',
        'country',
        'description',
        'flooringType',
        'maxPrice',
        'minPrice',
        'squareMeters',
        'state',
        'street',
        'title',
        'yearBuilt',
        'zip',
    ];

    constructor(
        public dialogRef: DialogRef<unknown, IFilterRealEstateListingsModalProps>,
        @Inject(DIALOG_DATA) public data: IFilterRealEstateListingsModalProps,
        staticApiDataService: StaticApiDataService,
    ) {
        this.form = data.form;
        this.onSubmitCallback = data.onSubmit;

        this.realEstateListingTypeOptions = Object.entries(staticApiDataService.getOptions().realEstateListingTypes).map<SelectOpt<string>>(
            ([value, label]) => ({ value: value, label: label }),
        );
    }

    onReset(event: Event) {
        event.preventDefault();
        this.form.reset();
    }

    closeModal() {
        this.dialogRef.close();
    }

    async onSubmit() {
        this.onSubmitCallback(this.form);
        this.closeModal();
    }
}
