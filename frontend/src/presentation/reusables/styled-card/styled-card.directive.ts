import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
    selector: '[appMixinStyledCard]',
})
export class MixinStyledCardDirective implements OnInit {
    @Input() appMixinStyledCard!: {
        size: 'mixin-Scard-base';
        theme: 'theme-Scard-generic-white';
        hasShadow?: boolean;
        hasDivide?: boolean;
        hasBorder?: boolean;
    };

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        const { size, theme, hasShadow = false, hasDivide = false, hasBorder = false } = this.appMixinStyledCard;

        // Apply base class
        this.renderer.addClass(this.el.nativeElement, 'mixin-Scard-like');
        // Apply size and theme classes
        this.renderer.addClass(this.el.nativeElement, size);
        this.renderer.addClass(this.el.nativeElement, theme);

        if (hasShadow) {
            this.renderer.addClass(this.el.nativeElement, 'token-default-shadow');
        }

        if (hasDivide) {
            this.renderer.addClass(this.el.nativeElement, 'divide-y');
            this.renderer.addClass(this.el.nativeElement, 'token-default-divide-color');
        }

        if (hasBorder) {
            this.renderer.addClass(this.el.nativeElement, 'border');
            this.renderer.addClass(this.el.nativeElement, 'token-default-border-color');
        }
    }
}
