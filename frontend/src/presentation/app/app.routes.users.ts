import { Routes } from "@angular/router";
import { LoginUserPageComponent } from "./users/login-user-page/login-user-page.component";
import { RegisterUserPageComponent } from "./users/register-user-page/register-user-page.component";

export const usersRoutes: Routes = [
    {
        path: 'users',
        data: { breadcrumb: 'Users' },
        children: [
            {
                path: 'register',
                component: RegisterUserPageComponent,
                data: { breadcrumb: 'Register' },
            },
            {
                path: 'login',
                component: LoginUserPageComponent,
                data: { breadcrumb: 'Login' },
            },
        ],
    },
];