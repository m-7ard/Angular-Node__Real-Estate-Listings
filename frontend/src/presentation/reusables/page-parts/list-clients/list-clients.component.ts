import { Component, OnInit } from '@angular/core';
import { RealEsateListingComponent } from '../../models/real-estate-listing/real-estate-listing.component';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';
import { ClientComponent } from "../../models/client/client.component";

@Component({
    selector: 'app-list-clients',
    standalone: true,
    imports: [MixinStyledButtonDirective, RealEsateListingComponent, ClientComponent],
    templateUrl: './list-clients.component.html',
})
export class ListClientsComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
