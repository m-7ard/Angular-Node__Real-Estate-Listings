import { Directive } from '@angular/core';

@Directive({
    selector: '[appPanelSectionDirective]',
    host: { 'data-role': 'panel-section' },
})
export class PanelSectionDirective {}
