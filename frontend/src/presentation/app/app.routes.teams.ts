import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth-guard';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { CreateTeamPageComponent } from './teams/create-team-page/create-team-page.component';
import { ListTeamsPageComponent } from './teams/list-teams-page/list-teams-page.component';
import { ListTeamsPageResolver } from './teams/list-teams-page/list-teams-page.resolver';
import { TeamsLayoutComponent } from './teams/teams-layout/teams-layout.component';

export const teamsRoutes: Routes = [
    {
        path: 'teams',
        data: { breadcrumb: 'Teams' },
        children: [
            {
                path: '',
                component: TeamsLayoutComponent,
                data: { breadcrumb: null },
                children: [
                    {
                        path: '',
                        component: ListTeamsPageComponent,
                        resolve: { [RESOLVER_DATA_KEY]: ListTeamsPageResolver },
                        data: { breadcrumb: null },
                    },
                    {
                        path: 'create',
                        component: CreateTeamPageComponent,
                        canActivate: [AuthGuard],
                        data: { breadcrumb: 'Create' },
                    },
                ],
            },
            {
                path: ':teamId',
                data: { breadcrumb: ':teamId' },
                loadChildren: () => import('./app.routes.team-detail').then((m) => m.teamDetailRoutes),
            },
        ],
    },
];
