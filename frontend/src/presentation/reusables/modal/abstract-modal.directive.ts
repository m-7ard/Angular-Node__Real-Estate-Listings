import { AfterViewInit, Directive, ViewChild } from "@angular/core";
import { ModalComponent } from "./modal.component";


@Directive()
export abstract class AbstractModalDirective implements AfterViewInit {
    @ViewChild(ModalComponent) modalComponent!: ModalComponent;
    public afterInit: (modalComponent: ModalComponent) => void = null!;

    ngAfterViewInit(): void {
        this.afterInit(this.modalComponent);
    }

    close() {
        this.modalComponent.close()
    }
}