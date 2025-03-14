import { Directive } from '@angular/core';

@Directive({
    selector: '[appPageSectionDirective]',
    host: { 'data-role': 'page-section' },
    standalone: true
})
export class PageSectionDirective {}
