import { Routes } from "@angular/router";
import { RESOLVER_DATA_KEY } from "../utils/RESOLVER_DATA";
import { errorRoutes } from "./app.routes.errors";
import { matchesRoutes } from "./app.routes.matches";
import { playersRoutes } from "./app.routes.players";
import { teamsRoutes } from "./app.routes.teams";
import { usersRoutes } from "./app.routes.users";
import { FrontpageComponent } from "./frontpage/frontpage.component";
import { FrontpageResolver } from "./frontpage/frontpage.resolver";
import { PageDoesNotExistPageComponent } from "./other/page-does-not-exist";

export const routes: Routes = [
    // Main routes
    {
        path: '',
        component: FrontpageComponent,
        resolve: { [RESOLVER_DATA_KEY]: FrontpageResolver },
        data: { breadcrumb: 'Home' },
    },

    // Feature modules
    ...playersRoutes,
    ...teamsRoutes,
    ...usersRoutes,
    ...matchesRoutes,
    
    // Error routes
    ...errorRoutes,

    // Catch-all route
    {
        path: 'page-does-not-exist',
        component: PageDoesNotExistPageComponent,
    },
    { path: '**', redirectTo: 'page-does-not-exist' },
];