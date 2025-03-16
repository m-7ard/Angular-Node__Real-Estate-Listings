import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MixinStyledButtonDirective } from '../../reusables/styled-button/styled-button.directive';
import { RealEsateListingComponent } from "../../reusables/models/real-estate-listing/real-estate-listing.component";

@Component({
    selector: 'app-frontpage',
    standalone: true,
    imports: [MixinStyledButtonDirective, RealEsateListingComponent],
    templateUrl: './frontpage.component.html',
})
export class FrontpageComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {}
}
