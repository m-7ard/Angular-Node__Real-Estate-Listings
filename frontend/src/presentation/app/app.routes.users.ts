import { Routes } from "@angular/router";

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