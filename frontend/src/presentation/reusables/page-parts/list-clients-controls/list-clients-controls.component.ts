import { Component, OnInit } from '@angular/core';
import { RealEsateListingComponent } from '../../models/real-estate-listing/real-estate-listing.component';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';
import { ClientComponent } from "../../models/client/client.component";
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-list-clients-controls',
    standalone: true,
    imports: [MixinStyledButtonDirective, RouterModule],
    templateUrl: './list-clients-controls.component.html',
})
export class ListClientsControlsComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
