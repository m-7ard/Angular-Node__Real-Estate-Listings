import { Component } from '@angular/core';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import Client from '../../../../../models/Client';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';
import { IUpdateClientPageResolverData } from './update-clinet-page.resolver';

interface IFormControls {
    name: FormControl<string>;
    type: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    name: string[];
    type: string[];
}>;

@Component({
    selector: 'app-update-client-page',
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
    templateUrl: './update-client-page.component.html',
})
export class UpdateClientPageComponent {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};
    clientTypeOptions: Array<SelectOpt<string>>;
    client: Client = null!;

    private get initialData() {
        return {
            name: this.client.name,
            type: this.client.type,
        };
    }

    constructor(
        private readonly dataAccess: ClientDataAccessService,
        private readonly exceptionNoticeService: ExceptionNoticeService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
        staticApiDataService: StaticApiDataService,
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

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IUpdateClientPageResolverData;
            this.client = data.client;
        });

        this.form.patchValue(this.initialData);
    }

    onReset(event: Event): void {
        event.preventDefault();
        this.form.reset(this.initialData);
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
