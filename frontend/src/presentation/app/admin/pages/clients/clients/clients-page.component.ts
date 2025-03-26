import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
import { FilterClientsModal, IFilterClientsModalProps } from '../../../../../reusables/modals/delete-player-modal/filter-clients-modal.component';
import { Dialog, DialogRef } from '@angular/cdk/dialog';

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
    dialogRef: DialogRef<unknown, typeof FilterClientsModal.prototype> | null = null;
    dialog = inject(Dialog);
    
    public form: FormGroup<IFilterClientFormControls>;

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

    public onFilter(clients: Client[]) {
        this.clients = clients;
    }

    public toggleFilterClientsModal = () => {
        if (this.dialogRef == null || this.dialogRef.closed) {
            const data: IFilterClientsModalProps = {
                form: this.form,
                onSuccess: (clients) => {
                    this.clients = clients;
                }
            };
    
            this.dialogRef = this.dialog.open(FilterClientsModal, {  
                data: data,
            });
        } else {
            this.dialogRef.close();
        }
    }

    toggleClient(client: Client) {
        this.selectedClients.has(client) ? this.selectedClients.delete(client) : this.selectedClients.add(client);
    }

    @ViewChild('op') op!: Popover;

    constructor(private activatedRoute: ActivatedRoute) {
        this.form = new FormGroup<IFilterClientFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            type: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IClientsPageResolverData;
            this.clients = data.clients;
        });
    }
}
