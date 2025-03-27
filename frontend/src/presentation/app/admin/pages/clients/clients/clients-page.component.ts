import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ListClientsComponent } from '../../../../../reusables/page-parts/list-clients/list-clients.component';
import { ListClientsControlsComponent } from '../../../../../reusables/page-parts/list-clients-controls/list-clients-controls.component';
import { IClientsPageResolverData } from './clients-page.resolver';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';
import Client from '../../../../../models/Client';
import { CheckboxComponent } from '../../../../../reusables/widgets/checkbox/checkbox.component';
import { Popover, PopoverModule } from 'primeng/popover';
import { PrimeNgPopoverDirective } from '../../../../../reusables/prime-ng-popover/prime-ng-popover.directive';
import { PanelDirective } from '../../../../../reusables/panel/panel.directive';
import { PanelSectionDirective } from '../../../../../reusables/panel/panel-section.directive';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { DividerComponent } from '../../../../../reusables/divider/divider.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    FilterClientsModal,
    IFilterClientsModalProps,
} from '../../../../../reusables/modals/filter-clients-modal/filter-clients-modal.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ClientDataAccessService } from '../../../../../services/data-access/client-data-access.service';
import { ExceptionNoticeService } from '../../../../../services/exception-notice.service';

export interface IFilterClientFormControls {
    name: FormControl<string>;
    type: FormControl<string>;
}

@Component({
    selector: 'app-clients-page',
    standalone: true,
    imports: [
        ListClientsComponent,
        ListClientsControlsComponent,
        CheckboxComponent,
        PrimeNgPopoverDirective,
        PopoverModule,
        PanelDirective,
        PanelSectionDirective,
        MixinStyledButtonDirective,
        DividerComponent,
        CommonModule,
        RouterModule,
    ],
    templateUrl: './clients-page.component.html',
})
export class ClientsPageComponent implements OnInit {
    // Dialog
    dialogRef: DialogRef<unknown, typeof FilterClientsModal.prototype> | null = null;
    dialog = inject(Dialog);

    // Form
    public form: FormGroup<IFilterClientFormControls>;

    // Client Controls
    public clients: Client[] = null!;
    public selectedClients: Set<Client> = new Set();
    public selectAllClients = (all: boolean) => {
        this.selectedClients = all ? new Set(this.clients) : new Set();
    };

    public get selectedClientsIds() {
        const result: string[] = [];
        this.selectedClients.forEach(({ id }) => result.push(id));
        return result;
    }

    @ViewChild('op') op!: Popover;

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
    ) {
        this.form = new FormGroup<IFilterClientFormControls>({
            name: new FormControl('', { nonNullable: true }),
            type: new FormControl('', { nonNullable: true }),
        });
    }

    public onFilter(clients: Client[]) {
        this.clients = clients;
    }

    public toggleFilterClientsModal = () => {
        if (this.dialogRef == null || this.dialogRef.closed) {
            const data: IFilterClientsModalProps = {
                form: this.form,
                onSubmit: (form) => {
                    this.router.navigate([], { queryParams: { ...form.getRawValue() } });
                },
            };

            this.dialogRef = this.dialog.open(FilterClientsModal, {
                data: data,
            });
        } else {
            this.dialogRef.close();
        }
    };

    toggleClient(client: Client) {
        this.selectedClients.has(client) ? this.selectedClients.delete(client) : this.selectedClients.add(client);
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IClientsPageResolverData;
            this.clients = data.clients;
        });

        this.activatedRoute.queryParams.subscribe((queryParams) => {
            this.form.patchValue(queryParams);
        });
    }
}
