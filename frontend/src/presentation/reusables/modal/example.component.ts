import { Component, Input } from '@angular/core';
import { ModalComponent } from './modal.component';
import { AbstractModalDirective } from './abstract-modal.directive';
import { MixinStyledButtonDirective } from '../styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../styled-card/styled-card.module';

@Component({
    selector: 'app-drawer-modal',
    imports: [ModalComponent, MixinStyledCardDirectivesModule, MixinStyledButtonDirective],
    template: `
        <app-modal>
            <div
                [appMixinStyledCard]="{
                    size: 'mixin-Scard-base',
                    theme: 'theme-Scard-generic-white'
                }"
                class="mixin-panel-like mixin-panel-base theme-panel-generic-white"
            >
                <header appMixinStyledCardSection class="flex flex-row gap-3 justify-between items-start">
                    <div>
                        <div class="token-card--header--primary-text">Sample Modal</div>
                    </div>
                    <button
                        [appMixinStyledButton]="{
                            size: 'mixin-Sbutton-sm',
                            theme: 'theme-Sbutton-generic-white'
                        }"
                        (click)="close()"
                    >
                        Close
                    </button>
                </header>
                <main appMixinStyledCardSection>
                    <div class="token-card--default-text">Title: {{ title }}</div>
                </main>
                <footer appMixinStyledCardSection>
                    <button
                        [appMixinStyledButton]="{
                            size: 'mixin-Sbutton-base',
                            theme: 'theme-Sbutton-generic-white'
                        }"
                        (click)="close()"
                    >
                        Close
                    </button>
                </footer>
            </div>
        </app-modal>
    `,
    standalone: true,
})
export class DrawerModalComponent extends AbstractModalDirective {
    @Input() title!: string;
}
