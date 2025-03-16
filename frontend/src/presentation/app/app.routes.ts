import { Routes } from "@angular/router";
import { errorRoutes } from "./app.routes.errors";
import { FrontpageComponent } from "./frontpage/frontpage.component";
import { PageDoesNotExistPageComponent } from "./other/page-does-not-exist";
import { usersRoutes } from "./app.routes.users";
import { adminRoutes } from "./app.routes.admin";

export const routes: Routes = [
    // Main routes
    {
        path: '',
        component: FrontpageComponent,
    },

    // Feature modules
    ...adminRoutes,
    ...usersRoutes,
    
    // Error routes
    ...errorRoutes,

    // Catch-all route
    {
        path: 'page-does-not-exist',
        component: PageDoesNotExistPageComponent,
    },
    { path: '**', redirectTo: 'page-does-not-exist' },
];