import { Component, Input, OnInit } from '@angular/core';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import RealEstateListing from '../../../models/RealEstateListing';

@Component({
    selector: 'app-list-real-estate-listings-controls',
    standalone: true,
    imports: [MixinStyledButtonDirective, RouterModule, CommonModule],
    templateUrl: './list-real-estate-listings-controls.component.html',
})
export class ListRealEstateListingsControlsComponent implements OnInit {
    @Input() searchQuery: string = null!;
    @Input() listings: RealEstateListing[] = null!;
    
    constructor() {}

    ngOnInit() {}
}
