import { Injectable } from '@angular/core';
import ILoginUserRequestDTO from '../../contracts/users/login/ILoginUserRequestDTO';
import IRegisterUserRequestDTO from '../../contracts/users/register/IRegisterUserRequestDTO';
import IRegisterUserResponseDTO from '../../contracts/users/register/IRegisterUserResponseDTO';
import ILoginUserResponseDTO from '../../contracts/users/login/ILoginUserResponseDTO';
import ICurrentUserResponseDTO from '../../contracts/users/get-current/ICurrentUserResponseDTO';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserDataAccessService {
    private readonly _baseUrl = `${environment.apiUrl}/api/users`;
    constructor(private http: HttpClient) {}

    register(request: IRegisterUserRequestDTO) {
        return this.http.post<IRegisterUserResponseDTO>(`${this._baseUrl}/register`, request);
    }

    login(request: ILoginUserRequestDTO) {
        return this.http.post<ILoginUserResponseDTO>(`${this._baseUrl}/login`, request);
    }

    getCurrentUser() {
        return this.http.get<ICurrentUserResponseDTO>(`${this._baseUrl}/current`);
    }
}
