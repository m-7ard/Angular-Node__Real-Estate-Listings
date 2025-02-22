import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
    selector: '[appContentGrid]',
})
export class ContentGridDirective implements OnInit {
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        this.renderer.addClass(this.el.nativeElement, "mixin-content-grid");
    }
}
