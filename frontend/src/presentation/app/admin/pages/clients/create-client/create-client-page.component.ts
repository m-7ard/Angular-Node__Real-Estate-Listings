import { Component, OnInit } from '@angular/core';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ContentGridTrackDirective } from '../../../../../reusables/content-grid/content-grid-track.directive';
import { ContentGridDirective } from '../../../../../reusables/content-grid/content-grid.directive';
import { FormErrorsComponent } from '../../../../../reusables/form-errors/form-errors';
import { FormFieldComponent } from '../../../../../reusables/form-field/form-field.component';
import { PageSectionDirective } from '../../../../../reusables/page/page-section.directive';
import { PageDirective } from '../../../../../reusables/page/page.directive';
import { CharFieldComponent } from '../../../../../reusables/widgets/char-field/char-field.component';
import { ClientDataAccessService } from '../../../../../services/data-access/client-data-access.service';
import IPresentationError from '../../../../../errors/IPresentationError';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';
import PresentationErrorFactory from '../../../../../errors/PresentationErrorFactory';
import { ExceptionNoticeService } from '../../../../../services/exception-notice.service';
import { StaticApiDataService } from '../../../../../services/static-api-data-service';
import { SelectComponent, SelectOpt } from '../../../../../reusables/widgets/select/select.component';

interface IFormControls {
    name: FormControl<string>;
    type: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    name: string[];
    type: string[];
}>;

@Component({
    selector: 'app-create-client-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CharFieldComponent,
        FormFieldComponent,
        CommonModule,
        MixinStyledButtonDirective,
        FormErrorsComponent,
        PageDirective,
        PageSectionDirective,
        RouterModule,
        SelectComponent,
    ],
    templateUrl: './create-client-page.component.html',
})
export class CreateClientPageComponent {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};
    clientTypeOptions: Array<SelectOpt<string>>;

    constructor(
        private readonly dataAccess: ClientDataAccessService,
        private readonly exceptionNoticeService: ExceptionNoticeService,
        private readonly router: Router,
        private readonly staticApiDataService: StaticApiDataService,
    ) {
        this.form = new FormGroup<IFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            type: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });

        this.clientTypeOptions = Object.entries(staticApiDataService.getOptions().clientTypes).map<SelectOpt<string>>(
            ([value, label]) => ({ value: value, label: label }),
        );
    }

    onReset(): void {
        this.form.reset({
            name: '',
            type: '',
        });
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.dataAccess
            .create({
                name: rawValue.name,
                type: rawValue.type,
            })
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

                    this.router.navigate(['/admin/clients']);
                },
            });
    }
}
