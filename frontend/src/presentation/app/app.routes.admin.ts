import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin/admin-layout.component';
import { RESOLVER_DATA_KEY } from '../utils/RESOLVER_DATA';
import { ListRealEstateListingsPageResolver } from './admin/pages/real-estate-listings/real-estate-listings-page.resolver';
import { ListRealEstateListingsPageComponent } from './admin/pages/real-estate-listings/real-estate-listings-page.component';
import { AuthGuard } from '../guards/auth-guard';
import { ClientsPageComponent } from './admin/pages/clients/clients-page.component';
import { CreateClientPageComponent } from './admin/pages/create-client/create-client-page.component';
import { ClientsPageResolver } from './admin/pages/clients/clients-page.resolver';
import { CreateRealEstateListingsPageComponent } from './admin/pages/create-real-estate-listings/create-real-estate-listings-page.component';

export const adminRoutes: Routes = [
    {
        path: 'admin',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: AdminLayoutComponent,
                children: [
                    {
                        path: 'real-estate-listings',
                        children: [
                            {
                                path: '',
                                component: ListRealEstateListingsPageComponent,
                            },
                            {
                                path: "create",
                                component: CreateRealEstateListingsPageComponent,
                            }
                        ],
                    },
                    {
                        path: 'clients',
                        children: [
                            {
                                path: '',
                                component: ClientsPageComponent,
                                resolve: { [RESOLVER_DATA_KEY]: ClientsPageResolver }
                            },
                            {
                                path: "create",
                                component: CreateClientPageComponent,
                            }
                        ],
                    },
                ],
            },
        ],
    },
];
