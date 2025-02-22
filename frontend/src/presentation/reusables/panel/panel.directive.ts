import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({
    selector: '[appPanelDirective]',
})
export class PanelDirective implements OnInit {
    @Input() appPanelDirective!: {
        panelSize: 'mixin-panel-base';
        panelTheme: 'theme-panel-generic-white';
        panelHasBorder?: boolean;
        panelHasShadow?: boolean;
    };

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit(): void {
        const { panelSize, panelTheme, panelHasShadow, panelHasBorder } = this.appPanelDirective;

        this.renderer.addClass(this.el.nativeElement, 'mixin-panel-like');
        this.renderer.addClass(this.el.nativeElement, panelSize);
        this.renderer.addClass(this.el.nativeElement, panelTheme);

        if (panelHasShadow) {
            this.renderer.addClass(this.el.nativeElement, 'token-default-shadow');
        }

        if (panelHasBorder) {
            this.renderer.addClass(this.el.nativeElement, 'border');
            this.renderer.addClass(this.el.nativeElement, 'token-default-border-color');
        }
    }
}
