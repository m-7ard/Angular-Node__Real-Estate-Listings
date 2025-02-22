import { Component, HostListener, Input } from '@angular/core';

@Component({
    selector: 'app-modal',
    template: `
        <div
            class="fixed inset-0 bg-black/40 flex flex-row items-center justify-center"
            [style.zIndex]="zIndex"
            (mousedown)="onBackdropClick($event)"
        >
            <div style="display: contents;" (mousedown)="$event.stopPropagation()">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    standalone: true,
})
export class ModalComponent {
    @Input() zIndex = 1000;
    public closeFn!: () => void;

    @HostListener('document:keydown.escape')
    onEscapePress() {
        this.close();
    }

    close() {
        this.closeFn();
    }

    protected onBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            this.close()
        }
    }
}
