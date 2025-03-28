import { Component, inject, Input, OnInit } from '@angular/core';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import RealEstateListing from '../../../models/RealEstateListing';
import { DialogRef, Dialog } from '@angular/cdk/dialog';
import {
    FilterRealEstateListingsModal,
    IFilterRealEstateListingsModalProps,
} from '../../modals/filter-real-estate-listings-modal/filter-real-estate-listings-modal.component';
import { FormControl, FormGroup } from '@angular/forms';

export interface IFilterRealEstateListingsFormControls {
    bathroomNumber: FormControl<string>;
    bedroomNumber: FormControl<string>;
    city: FormControl<string>;
    country: FormControl<string>;
    description: FormControl<string>;
    flooringType: FormControl<string>;
    maxPrice: FormControl<string>;
    minPrice: FormControl<string>;
    squareMeters: FormControl<string>;
    state: FormControl<string>;
    street: FormControl<string>;
    title: FormControl<string>;
    type: FormControl<string>;
    yearBuilt: FormControl<string>;
    zip: FormControl<string>;
}

@Component({
    selector: 'app-list-real-estate-listings-controls',
    standalone: true,
    imports: [MixinStyledButtonDirective, RouterModule, CommonModule],
    templateUrl: './list-real-estate-listings-controls.component.html',
})
export class ListRealEstateListingsControlsComponent implements OnInit {
    dialogRef: DialogRef<unknown, typeof FilterRealEstateListingsModal.prototype> | null = null;
    dialog = inject(Dialog);

    public form: FormGroup<IFilterRealEstateListingsFormControls>;

    @Input() searchQuery: string = null!;
    @Input() listings: RealEstateListing[] = null!;

    public toggleFilterListingsModal = () => {
        if (this.dialogRef == null || this.dialogRef.closed) {
            const data: IFilterRealEstateListingsModalProps = {
                form: this.form,
                onSubmit: (form) => {
                    this.router.navigate([], { queryParams: { ...form.getRawValue() } });
                },
            };

            this.dialogRef = this.dialog.open(FilterRealEstateListingsModal, { data: data });
        } else {
            this.dialogRef.close();
        }
    };

    constructor(private readonly router: Router) {
        this.form = new FormGroup<IFilterRealEstateListingsFormControls>({
            bathroomNumber: new FormControl('', { nonNullable: true }),
            bedroomNumber: new FormControl('', { nonNullable: true }),
            city: new FormControl('', { nonNullable: true }),
            country: new FormControl('', { nonNullable: true }),
            description: new FormControl('', { nonNullable: true }),
            flooringType: new FormControl('', { nonNullable: true }),
            maxPrice: new FormControl('', { nonNullable: true }),
            minPrice: new FormControl('', { nonNullable: true }),
            squareMeters: new FormControl('', { nonNullable: true }),
            state: new FormControl('', { nonNullable: true }),
            street: new FormControl('', { nonNullable: true }),
            title: new FormControl('', { nonNullable: true }),
            type: new FormControl('', { nonNullable: true }),
            yearBuilt: new FormControl('', { nonNullable: true }),
            zip: new FormControl('', { nonNullable: true }),
        });
    }

    ngOnInit() {
        console.log("searchQuery", this.searchQuery)
    }
}
