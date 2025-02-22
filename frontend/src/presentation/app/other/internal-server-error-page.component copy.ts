import { Component } from '@angular/core';
import InternalServerErrorException from '../../exceptions/InternalServerErrorException';
import { Router } from '@angular/router';

@Component({
    selector: 'internal-server-error-page',
    standalone: true,
    imports: [],
    template: `
        <div class="mixin-page-like mixin-page-base mixin-content-grid flex flex-col grow">
            <main class="flex flex-col gap-2 items-center justify-center grow text-center" data-track="base">
                <div class="text-4xl font-bold">
                    500 Internal Server Error
                </div>
                <div class="text-xl">
                    {{ error.message }}
                </div>
            </main>
        </div>
    `,
    host: {
        class: 'flex flex-col grow',
    },
})
export class InternalServerErrorPageComponent {
    error: InternalServerErrorException;
    protected FALLBACK = new InternalServerErrorException(
        "An Internal Server Error has Occurred. State is missing from router.",
    );

    constructor(private router: Router) {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state;
        if (state == null) {
            this.error = this.FALLBACK;
            return;
        }

        const error: InternalServerErrorException | null = state['error'];
        this.error = error == null ? this.FALLBACK : error;
    }
}
