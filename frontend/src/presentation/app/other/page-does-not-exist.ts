import { Component } from '@angular/core';

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
                <div class="text-4xl font-bold">Page Does Not Exist</div>
            </main>
        </div>
    `,
})
export class PageDoesNotExistPageComponent {}
