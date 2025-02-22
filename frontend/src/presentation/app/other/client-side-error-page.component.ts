import { Component } from '@angular/core';
import ClientSideErrorException from '../../exceptions/ClientSideErrorException';
import { Router } from '@angular/router';

@Component({
    selector: 'client-side-error-page',
    standalone: true,
    imports: [],
    template: `
        <div class="mixin-page-like mixin-page-base mixin-content-grid flex flex-col grow">
            <main class="flex flex-col gap-2 items-center justify-center grow text-center" data-track="base">
                <div class="text-4xl font-bold">
                    Client Side Error
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
export class ClientSideErrorPageComponent {
    error: ClientSideErrorException;
    protected FALLBACK = new ClientSideErrorException(
        "A Client-Side Error has Occurred. State is missing from router.",
    );

    constructor(private router: Router) {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state;

        if (state == null) {
            this.error = this.FALLBACK;
            return;
        }

        const error: ClientSideErrorException | null = state['error'];
        this.error = error == null ? this.FALLBACK : error;
    }
}
