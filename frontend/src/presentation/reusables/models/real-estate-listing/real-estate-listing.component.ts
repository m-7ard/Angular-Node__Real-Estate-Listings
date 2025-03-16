import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import RealEstateListing from '../../../models/RealEstateListing';
import { CoverImageComponent } from "../../cover-image/cover-image.component";

@Component({
    selector: 'app-real-estate-listing',
    standalone: true,
    imports: [CommonModule, CoverImageComponent],
    templateUrl: './real-estate-listing.component.html',
})
export class RealEsateListingComponent {
    // @Input() listing: RealEstateListing = null!;
}
