import { Routes } from "@angular/router";
import { RegisterUserPageComponent } from "./users/pages/register/register-page.component";
import { LoginUserPageComponent } from "./users/pages/login/login-page.component";

export const usersRoutes: Routes = [
    {
        path: 'users',
        children: [
            {
                path: 'register',
                component: RegisterUserPageComponent
            },
            {
                path: 'login',
                component: LoginUserPageComponent,
            },
        ],
    },
];