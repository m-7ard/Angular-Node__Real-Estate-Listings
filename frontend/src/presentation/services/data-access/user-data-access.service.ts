import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RegisterUserRequestDTO } from '../../contracts/users/register/RegisterUserRequestDTO';
import { CurrentUserResponseDTO } from '../../contracts/users/currentUser/CurrentUserResponseDTO';
import { LoginUserRequestDTO } from '../../contracts/users/login/LoginUserRequestDTO';
import { LoginUserResponseDTO } from '../../contracts/users/login/LoginUserResponseDTO';
import { RegisterUserResponseDTO } from '../../contracts/users/register/RegisterUserResponseDTO';

@Injectable({
    providedIn: 'root',
})
export class UserDataAccessService {
    private readonly _baseUrl = `${environment.apiUrl}/api/users`;
    constructor(private http: HttpClient) {}

    register(request: RegisterUserRequestDTO) {
        return this.http.post<RegisterUserResponseDTO>(`${this._baseUrl}/register`, request);
    }

    login(request: LoginUserRequestDTO) {
        return this.http.post<LoginUserResponseDTO>(`${this._baseUrl}/login`, request);
    }

    getCurrentUser() {
        return this.http.get<CurrentUserResponseDTO>(`${this._baseUrl}/current`);
    }
}
