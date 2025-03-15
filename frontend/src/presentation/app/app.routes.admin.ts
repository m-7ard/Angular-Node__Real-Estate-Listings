import { Routes } from "@angular/router";
import { RegisterUserPageComponent } from "./users/register/register-page.component";
import { LoginUserPageComponent } from "./users/pages/login/login-page.component";

export const adminRoutes: Routes = [
    {
        path: 'admin',
        children: [
            {
                path: '',
                component: RegisterUserPageComponent
            },
            {
                path: 'login',
                component: LoginUserPageComponent,
            },
        ],
    },
];