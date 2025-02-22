import {
    Directive,
    Input,
    ViewContainerRef,
    HostListener,
    ComponentRef,
    Type,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { AbstractModalDirective } from './abstract-modal.directive';

@Directive({
    selector: '[modalTrigger]',
    standalone: true,
})
export class ModalTriggerDirective<T extends AbstractModalDirective> implements OnChanges {
    @Input('modalPanel') panel!: Type<T>;
    @Input() modalData!: Partial<T>;

    private modalRef: ComponentRef<T> | null = null;

    constructor(private viewContainer: ViewContainerRef) {}
    
    ngOnChanges(changes: SimpleChanges): void {
        // If modal is already open and modalData has changed, update the inputs
        if (this.modalRef && changes['modalData']) {
            Object.entries(changes['modalData'].currentValue).forEach(([key, value]) => {
                this.modalRef?.setInput(key, value);
            });
        }
    }

    ngOnDestroy() {
        this.closeModal();
    }

    @HostListener('click')
    onClick() {
        if (this.modalRef == null) {
            this.openModal();
        } else {
            this.closeModal();
        }
    }

    private openModal() {
        this.modalRef = this.viewContainer.createComponent(this.panel);

        // Set initial inputs
        Object.entries(this.modalData).forEach(([key, value]) => {
            this.modalRef?.setInput(key, value);
        });

        this.modalRef.instance.afterInit = (modalComponent) => {
            modalComponent.closeFn = () => {
                this.closeModal();
            };
        };
    }

    private closeModal() {
        if (this.modalRef == null) {
            return;
        }

        this.modalRef.destroy();
        this.modalRef = null;
    }
}