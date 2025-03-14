import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { UserDataAccessService } from './data-access/user-data-access.service';
import { Router } from '@angular/router';
import User from '../models/User';
import { RegisterUserRequestDTO } from '../contracts/users/register/RegisterUserRequestDTO';
import { LoginUserRequestDTO } from '../contracts/users/login/LoginUserRequestDTO';
import { RegisterUserResponseDTO } from '../contracts/users/register/RegisterUserResponseDTO';
import ApiModelMappers from '../mappers/ApiModelMappers';

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

    register(userData: RegisterUserRequestDTO): Observable<RegisterUserResponseDTO> {
        return this.userDataAccess.register(userData);
    }

    login(request: LoginUserRequestDTO) {
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
                return dto.user == null ? null : ApiModelMappers.userApiModelToDomain(dto.user);
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
