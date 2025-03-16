import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./admin/admin-layout.component";
import { RESOLVER_DATA_KEY } from "../utils/RESOLVER_DATA";
import { ListRealEstateListingsPageResolver } from "./admin/pages/real-estate-listings/real-estate-listings-page.resolver";
import { ListRealEstateListingsPageComponent } from "./admin/pages/real-estate-listings/real-estate-listings-page.component";
import { AuthGuard } from "../guards/auth-guard";
import { ListClientsPageComponent } from "./admin/pages/clients/clients-page.component";

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
                        path: "real-estate-listings",
                        component: ListRealEstateListingsPageComponent,
                        // resolve: { [RESOLVER_DATA_KEY]: ListRealEstateListingsPageResolver },
                    },
                    {
                        path: "clients",
                        component: ListClientsPageComponent,
                        // resolve: { [RESOLVER_DATA_KEY]: ListClientsPageResolver },
                    }
                ]
            },
        ],
    },
];