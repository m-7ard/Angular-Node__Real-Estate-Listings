import { Routes } from "@angular/router";
import { ClientSideErrorPageComponent } from "./other/client-side-error-page.component";
import { InternalServerErrorPageComponent } from "./other/internal-server-error-page.component copy";
import { NotFoundPageComponent } from "./other/not-found-page.component";
import { UnknownErrorPageComponent } from "./other/unknown-error-page.component";

export const errorRoutes: Routes = [
    {
        path: 'not-found',
        component: NotFoundPageComponent,
    },
    {
        path: 'internal-server-error',
        component: InternalServerErrorPageComponent,
    },
    {
        path: 'unknown-error',
        component: UnknownErrorPageComponent,
    },
    {
        path: 'client-side-error',
        component: ClientSideErrorPageComponent,
    },
];