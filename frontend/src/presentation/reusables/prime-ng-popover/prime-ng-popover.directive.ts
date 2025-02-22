import { Directive, Input, ElementRef, HostListener, OnInit } from '@angular/core';
import positionFixedContainer from '../../utils/fixedContainers/positionFixedContainer';
import fitFixedContainer from '../../utils/fixedContainers/fitFixedContainer';
import { Popover } from 'primeng/popover';

@Directive({
    selector: '[primeNgPopoverDirective]',
    standalone: true,
})
export class PrimeNgPopoverDirective implements OnInit {
    @Input() popover!: Popover;
    @Input() positioning: Partial<Record<"top" | "left" | "bottom" | "right", string>> = { top: '100%', right: '0px', left: '0px' };

    constructor(private el: ElementRef) {}

    ngOnInit(): void {
        this.popover.onShow.subscribe(this.open);
        this.popover.onHide.subscribe(this.close);
    }

    private placeTooltip = () => {
        const targetElement = this.popover.container;
        if (!targetElement) return;

        const referenceElement = this.el.nativeElement;
        positionFixedContainer(targetElement, referenceElement, this.positioning);
        fitFixedContainer(targetElement);
    };

    open = () => {
        this.placeTooltip();
        window.addEventListener('resize', this.placeTooltip);
    }

    close = () => {
        window.removeEventListener('resize', this.placeTooltip);
    };

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        this.popover.toggle(event);
    }
}
