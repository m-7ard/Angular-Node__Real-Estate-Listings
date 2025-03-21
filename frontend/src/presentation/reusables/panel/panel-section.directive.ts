import { Directive } from '@angular/core';

@Directive({
    selector: '[appPanelSectionDirective]',
    host: { 'data-role': 'panel-section' },
    standalone: true
})
export class PanelSectionDirective {}
