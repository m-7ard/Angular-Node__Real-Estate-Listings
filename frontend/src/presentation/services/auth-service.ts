import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import User from '../models/User';
import { UserDataAccessService } from './data-access/user-data-access.service';
import ILoginUserRequestDTO from '../contracts/users/login/ILoginUserRequestDTO';
import UserMapper from '../mappers/UserMapper';
import IRegisterUserRequestDTO from '../contracts/users/register/IRegisterUserRequestDTO';
import IRegisterUserResponseDTO from '../contracts/users/register/IRegisterUserResponseDTO';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(
        private userDataAccess: UserDataAccessService,
        private router: Router,
    ) {
        this.loadCurrentUser().subscribe();
    }

    register(userData: IRegisterUserRequestDTO): Observable<IRegisterUserResponseDTO> {
        return this.userDataAccess.register(userData);
    }

    login(request: ILoginUserRequestDTO) {
        return this.userDataAccess.login(request).pipe(
            switchMap((response) => {
                localStorage.setItem('auth_token', response.token);
                return this.loadCurrentUser();
            }),
        );
    }

    loadCurrentUser(): Observable<User | null> {
        const token = localStorage.getItem('auth_token');
        // console.log("token in load current:", token)

        if (!token) {
            this.currentUserSubject.next(null);
            this.isAuthenticatedSubject.next(false);
            return of(null);
        }

        return this.userDataAccess.getCurrentUser().pipe(
            map((dto) => {
                return dto.user == null ? null : UserMapper.apiModelToDomain(dto.user);
            }),
            tap((user) => {
                this.currentUserSubject.next(user);
                this.isAuthenticatedSubject.next(user != null);
            }),
            catchError((error) => {
                this.logout();
                return of(null);
            }),
        );
    }

    logout(): void {
        localStorage.removeItem('auth_token');
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/']);
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }
}
