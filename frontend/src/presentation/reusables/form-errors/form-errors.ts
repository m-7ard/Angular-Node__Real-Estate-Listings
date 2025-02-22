import { Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MixinStyledCardDirectivesModule } from '../styled-card/styled-card.module';

@Component({
    selector: 'app-form-errors',
    standalone: true,
    imports: [CommonModule, MixinStyledCardDirectivesModule],
    template: `
        <div
            *ngIf="errors != null"
            [appMixinStyledCard]="{
                size: 'mixin-Scard-base',
                theme: 'theme-Scard-generic-white',
                hasBorder: true,
                hasDivide: true,
                hasShadow: true
            }"
        >
            <section appMixinStyledCardSection>
                <div class="token-card--header--primary-text">Form Errors</div>
            </section>
            <div appMixinStyledCardSection>
                <div class="token-card--header--secondary-text" *ngFor="let error of errors">
                    {{ error }}
                </div>
            </div>
        </div>
    `,
})
export class FormErrorsComponent {
    @Input() errors?: string[];

    @HostBinding('style.display') get displayStyle() {
        return this.errors == null ? 'none' : 'block';
    }
}
