import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { RealEsateListingComponent } from '../../../../reusables/models/real-estate-listing/real-estate-listing.component';
import { ListClientsComponent } from '../../../../reusables/page-parts/list-clients/list-clients.component';
import { ListClientsControlsComponent } from "../../../../reusables/page-parts/list-clients-controls/list-clients-controls.component";
import { DividerComponent } from "../../../../reusables/divider/divider.component";

@Component({
    selector: 'app-clients-page',
    standalone: true,
    imports: [MixinStyledButtonDirective, RealEsateListingComponent, ListClientsComponent, ListClientsControlsComponent, DividerComponent],
    templateUrl: './clients-page.component.html',
})
export class ListClientsPageComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {}
}
