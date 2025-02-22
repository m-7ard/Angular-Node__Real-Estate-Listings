import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-divider',
    standalone: true,
    imports: [CommonModule],
    template: `<div
        [ngClass]="{
            'h-0 w-full border-b token-default-border-color': !isVertical,
            'w-0 h-full border-r token-default-border-color': isVertical
        }"
    ></div>`,
})
export class DividerComponent {
    @Input() isVertical = false;
}
