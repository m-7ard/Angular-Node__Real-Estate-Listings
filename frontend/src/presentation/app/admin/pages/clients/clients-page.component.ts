import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListClientsComponent } from '../../../../reusables/page-parts/list-clients/list-clients.component';
import { ListClientsControlsComponent } from '../../../../reusables/page-parts/list-clients-controls/list-clients-controls.component';
import { IClientsPageResolverData } from './clients-page.resolver';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import Client from '../../../../models/Client';
import { CheckboxComponent } from '../../../../reusables/widgets/checkbox/checkbox.component';

@Component({
    selector: 'app-clients-page',
    standalone: true,
    imports: [ListClientsComponent, ListClientsControlsComponent, CheckboxComponent],
    templateUrl: './clients-page.component.html',
})
export class ClientsPageComponent implements OnInit {
    public clients: Client[] = null!;
    public selectedClients: Set<Client> = new Set();
    public selectAllClients = (all: boolean) => {
        this.selectedClients = all ? new Set(this.clients) : new Set();
    };

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IClientsPageResolverData;
            this.clients = data.clients;
        });
    }
}
