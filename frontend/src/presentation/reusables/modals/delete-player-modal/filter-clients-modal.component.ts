import { Component, Inject, Input } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormErrorsComponent } from '../../form-errors/form-errors';
import { ExceptionNoticeService } from '../../../services/exception-notice.service';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';
import { DividerComponent } from '../../divider/divider.component';
import { PanelDirective } from '../../panel/panel.directive';
import { PanelSectionDirective } from '../../panel/panel-section.directive';
import { ClientDataAccessService } from '../../../services/data-access/client-data-access.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IFilterClientFormControls } from '../../../app/admin/pages/clients/clients/clients-page.component';
import Client from '../../../models/Client';
import ApiModelMappers from '../../../mappers/ApiModelMappers';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { CharFieldComponent } from '../../widgets/char-field/char-field.component';
import { SelectComponent, SelectOpt } from '../../widgets/select/select.component';
import { StaticApiDataService } from '../../../services/static-api-data-service';

export interface IFilterClientsModalProps {
    form: FormGroup<IFilterClientFormControls>;
    onSuccess: (clients: Client[]) => void;
}

@Component({
    selector: 'app-filter-clients-modal',
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
    templateUrl: './filter-clients-modal.component.html',
})
export class FilterClientsModal {
    public form: FormGroup<IFilterClientFormControls> = null!;
    public onSuccess: (clients: Client[]) => void = null!;
    clientTypeOptions: Array<SelectOpt<string>>;

    constructor(
        public dialogRef: DialogRef<unknown, IFilterClientsModalProps>,
        @Inject(DIALOG_DATA) public data: IFilterClientsModalProps,
        private clientDataAccess: ClientDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
        private readonly staticApiDataService: StaticApiDataService,
    ) {
        this.form = data.form;
        this.onSuccess = data.onSuccess;

        this.clientTypeOptions = Object.entries(staticApiDataService.getOptions().clientTypes).map<SelectOpt<string>>(
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
        const rawValue = this.form.getRawValue();

        this.clientDataAccess
            .list({
                name: rawValue.name,
                type: rawValue.type,
            })
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.exceptionNoticeService.dispatchError(new Error(JSON.stringify(err.message)));
                    return of(null);
                }),
            )
            .subscribe({
                next: (response) => {
                    if (response === null) {
                        return;
                    }

                    this.onSuccess(response.clients.map(ApiModelMappers.clientApiModelToDomain));
                    this.closeModal();
                },
            });
    }
}
