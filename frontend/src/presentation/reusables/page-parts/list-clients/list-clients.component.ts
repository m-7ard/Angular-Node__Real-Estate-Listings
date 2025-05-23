import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClientComponent } from "../../models/client/client.component";
import Client from '../../../models/Client';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-list-clients',
    standalone: true,
    imports: [CommonModule, ClientComponent],
    templateUrl: './list-clients.component.html',
})
export class ListClientsComponent implements OnInit {
    @Input() clients: Client[] = null!;
    @Input() selectedClients: Set<Client> = null!;
    @Output() toggleClient = new EventEmitter<Client>();

    constructor() {}

    ngOnInit() {
    }
}
