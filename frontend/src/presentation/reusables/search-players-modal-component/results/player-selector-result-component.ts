import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CharFieldComponent } from '../../char-field/char-field.component';
import { CoverImageComponent } from '../../cover-image/cover-image.component';
import { DividerComponent } from '../../divider/divider.component';
import { FormFieldComponent } from '../../form-field/form-field.component';
import { PanelDirectivesModule } from '../../panel/panel.directive.module';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../styled-card/styled-card.module';
import { ZeebraTextComponent } from '../../zeebra-text/zeebra-text.component';
import Player from '../../../models/Player';

@Component({
    selector: 'app-player-selector-result-component',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CoverImageComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        PanelDirectivesModule,
    ],
    template: `
        <div
            [appMixinStyledCard]="{
                size: 'mixin-Scard-base',
                theme: 'theme-Scard-generic-white',
                hasBorder: true,
                hasDivide: true
            }"
        >
            <main appMixinStyledCardSection class="grid gap-3" style="grid-template: auto / auto 1fr">
                <div class="aspect-square theme-avatar-any">
                    <section class="relative h-full w-full flex">
                        <app-cover-image src=""></app-cover-image>
                    </section>
                </div>
                <div class="overflow-hidden">
                    <div class="token-card--header--primary-text">
                        {{ player.name }}
                    </div>
                </div>
            </main>
            <section appMixinStyledCardSection>
                <div class="token-default-list">
                    <span class="token-default-list__label">Id</span>
                    <span class="truncate token-default-list__value">
                        {{ player.id }}
                    </span>
                </div>
                <div class="token-default-list">
                    <span class="token-default-list__label">Active Since</span>
                    <span class="truncate token-default-list__value">
                        {{ player.activeSince | date }}
                    </span>
                </div>
            </section>
            <footer appMixinStyledCardSection class="grid grid-cols-1 gap-1">
                <button
                    [appMixinStyledButton]="{
                        size: 'mixin-Sbutton-base',
                        theme: 'theme-Sbutton-generic-green'
                    }"
                    *ngIf="isSelected; else notSelected"
                    class="justify-center"
                >
                    Already Selected
                </button>
                <ng-template #notSelected>
                    <button
                        [appMixinStyledButton]="{
                            size: 'mixin-Sbutton-base',
                            theme: 'theme-Sbutton-generic-yellow'
                        }"
                        (click)="selectPlayer()"
                        class="justify-center"
                    >
                        Select
                    </button>
                </ng-template>
            </footer>
        </div>
    `,
})
export class PlayerSelectResultComponent {
    @Input() player!: Player;
    @Input() selectPlayer!: () => void;
    @Input() isSelected!: boolean;
}
