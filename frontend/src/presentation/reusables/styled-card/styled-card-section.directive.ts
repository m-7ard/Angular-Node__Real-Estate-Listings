import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
    selector: '[appMixinStyledCardSection]',
    standalone: true
})
export class MixinStyledCardSectionDirective implements OnInit {
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        // Add a data attribute
        this.renderer.setAttribute(this.el.nativeElement, 'data-role', 'section');
    }
}
