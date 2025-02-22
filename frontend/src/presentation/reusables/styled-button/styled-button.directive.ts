import { Directive, ElementRef, Input, Renderer2, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[appMixinStyledButton]',
    standalone: true,
})
export class MixinStyledButtonDirective implements OnChanges {
    @Input() appMixinStyledButton!: {
        size: 'mixin-Sbutton-sm' | 'mixin-Sbutton-base';
        theme:
            | 'theme-Sbutton-generic-white'
            | 'theme-Sbutton-generic-yellow'
            | 'theme-Sbutton-generic-green'
            | 'theme-Sbutton-generic-red'
            | 'theme-Sbutton-generic-blue';
        hasShadow?: boolean;
        isStatic?: boolean;
        isSharp?: boolean;
    };

    private baseClass = 'mixin-Sbutton-like';
    private previousSize?: string;
    private previousTheme?: string;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        // Apply base class
        this.renderer.addClass(this.el.nativeElement, this.baseClass);

        const { size, theme, hasShadow = false, isStatic = false, isSharp = false } = this.appMixinStyledButton;

        // Apply initial size and theme classes
        if (size) {
            this.renderer.addClass(this.el.nativeElement, size);
            this.previousSize = size;
        }
        if (theme) {
            this.renderer.addClass(this.el.nativeElement, theme);
            this.previousTheme = theme;
        }

        if (hasShadow) {
            this.renderer.addClass(this.el.nativeElement, 'token-default-shadow');
        }

        if (isStatic) {
            this.renderer.addClass(this.el.nativeElement, 'mixin-Sbutton-like--static');
            this.renderer.addClass(this.el.nativeElement, `${theme}--static`);
        }

        if (isSharp) {
            this.renderer.addClass(this.el.nativeElement, 'mixin-Sbutton-like--sharp')
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Handle size changes
        if (changes['size'] && changes['size'].currentValue !== changes['size'].previousValue) {
            if (this.previousSize) {
                this.renderer.removeClass(this.el.nativeElement, this.previousSize);
            }
            this.renderer.addClass(this.el.nativeElement, changes['size'].currentValue);
            this.previousSize = changes['size'].currentValue;
        }

        // Handle theme changes
        if (changes['theme'] && changes['theme'].currentValue !== changes['theme'].previousValue) {
            if (this.previousTheme) {
                this.renderer.removeClass(this.el.nativeElement, this.previousTheme);
            }
            this.renderer.addClass(this.el.nativeElement, changes['theme'].currentValue);
            this.previousTheme = changes['theme'].currentValue;
        }
    }
}
