import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MixinStyledCardDirective } from '../styled-card/styled-card.directive';
import { MixinStyledCardSectionDirective } from '../styled-card/styled-card-section.directive';

@Component({
    selector: 'app-form-errors',
    standalone: true,
    imports: [CommonModule, MixinStyledCardDirective, MixinStyledCardSectionDirective],
    template: `
        <div
            *ngIf="errors != null"
            [appMixinStyledCard]="{
                size: 'mixin-Scard-base',
                theme: 'theme-Scard-generic-white',
                hasDivide: true,
                hasBorder: true
            }"
        >
            <section appMixinStyledCardSection>
                <div class="text-sm font-semibold">Form Errors</div>
                <div class="token-card--header--secondary-text" *ngFor="let error of errors">
                    &bull; {{ error }}
                </div>
            </section>
        </div>
    `,
})
export class FormErrorsComponent {
    @Input() errors?: string[];

    @HostBinding('style.display') get displayStyle() {
        return this.errors == null ? 'none' : 'block';
    }
}
