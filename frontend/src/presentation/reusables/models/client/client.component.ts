import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-client',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './client.component.html',
})
export class ClientComponent {
    // @Input() listing: RealEstateListing = null!;
}
