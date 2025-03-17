import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateClientResponseDTO } from '../../contracts/clients/create/CreateClientResponseDTO';
import { CreateClientRequestDTO } from '../../contracts/clients/create/CreateClientRequestDTO';
import { DeleteClientRequestDTO } from '../../contracts/clients/delete/DeleteClientRequestDTO';
import { DeleteClientResponseDTO } from '../../contracts/clients/delete/DeleteClientResponseDTO';
import { ListClientsRequestDTO } from '../../contracts/clients/list/ListClientsRequestDTO';
import urlWithQuery from '../../utils/urlWithQuery';
import { ListClientsResponseDTO } from '../../contracts/clients/list/ListClientsResponseDTO';
import { ReadClientResponseDTO } from '../../contracts/clients/read/ReadClientResponseDTO';
import { UpdateClientRequestDTO } from '../../contracts/clients/update/UpdateClientRequestDTO';
import { UpdateClientResponseDTO } from '../../contracts/clients/update/UpdateClientResponseDTO';

@Injectable({
    providedIn: 'root',
})
export class ClientDataAccessService {
    private readonly baseUrl = `${environment.apiUrl}/api/clients`;
    constructor(private http: HttpClient) {}

    create(request: CreateClientRequestDTO) {
        return this.http.post<CreateClientResponseDTO>(`${this.baseUrl}/create`, request);
    }

    delete(id: string, request: DeleteClientRequestDTO) {
        return this.http.delete<DeleteClientResponseDTO>(`${this.baseUrl}/${id}/delete`, { body: request });
    }

    list(request: ListClientsRequestDTO) {
        const url = urlWithQuery(`${this.baseUrl}`, request);
        return this.http.get<ListClientsResponseDTO>(url);
    }

    read(id: string) {
        return this.http.get<ReadClientResponseDTO>(`${this.baseUrl}/${id}`);
    }

    update(id: string, request: UpdateClientRequestDTO) {
        return this.http.post<UpdateClientResponseDTO>(`${this.baseUrl}/${id}/update`, request);
    }
}
