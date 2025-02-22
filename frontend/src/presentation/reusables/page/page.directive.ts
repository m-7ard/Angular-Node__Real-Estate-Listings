import { Directive, ElementRef, Input, Renderer2, OnInit, HostBinding } from '@angular/core';

@Directive({
    selector: '[appPageDirective]',
})
export class PageDirective implements OnInit {
    @Input() appPageDirective!: {
        pageSize: 'mixin-page-base';
        isSubpage?: boolean;
    };

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        const { pageSize, isSubpage = false } = this.appPageDirective;

        this.renderer.addClass(this.el.nativeElement, 'mixin-page-like');
        this.renderer.addClass(this.el.nativeElement, pageSize);

        if (isSubpage) {
            this.renderer.addClass(this.el.nativeElement, 'mixin-page-like--subpage');
        }
    }
}
