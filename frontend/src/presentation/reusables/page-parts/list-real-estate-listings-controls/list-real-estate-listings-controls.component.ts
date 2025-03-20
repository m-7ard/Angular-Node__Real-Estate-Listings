import { Component, OnInit } from '@angular/core';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-list-real-estate-listings-controls',
    standalone: true,
    imports: [MixinStyledButtonDirective, RouterModule],
    templateUrl: './list-real-estate-listings-controls.component.html',
})
export class ListRealEstateListingsControlsComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
