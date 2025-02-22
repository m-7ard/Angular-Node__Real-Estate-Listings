import { Component } from '@angular/core';
import { Router } from '@angular/router';
import NotFoundException from '../../exceptions/NotFoundException';

@Component({
    selector: 'app-not-found-page',
    standalone: true,
    imports: [],
    host: {
        class: 'flex flex-col grow',
    },
    template: `
        <div class="mixin-page-like mixin-page-base mixin-content-grid flex flex-col grow">
            <main class="flex flex-col gap-2 items-center justify-center grow text-center" data-track="base">
                <div class="text-4xl font-bold">404 Not Found</div>
                <div class="text-xl">{{ error.message }}</div>
            </main>
        </div>
    `,
})
export class NotFoundPageComponent {
    error: NotFoundException;
    protected FALLBACK = new NotFoundException(
        "The page or resource you're requesting doesn't exist. State is missing from router.",
    );

    constructor(private router: Router) {
        const navigation = this.router.getCurrentNavigation();
        const state = navigation?.extras.state;
        if (state == null) {
            this.error = this.FALLBACK;
            return;
        }

        const error: NotFoundException | null = state['error'];
        this.error = error == null ? this.FALLBACK : error;
    }
}
