import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import urlWithQuery from '../../utils/urlWithQuery';
import { CreateRealEstateListingRequestDTO } from '../../contracts/realEstateListings/create/CreateRealEstateListingRequestDTO';
import { CreateRealEstateListingResponseDTO } from '../../contracts/realEstateListings/create/CreateRealEstateListingResponseDTO';
import { DeleteRealEstateListingRequestDTO } from '../../contracts/realEstateListings/delete/DeleteRealEstateListingRequestDTO';
import { DeleteRealEstateListingResponseDTO } from '../../contracts/realEstateListings/delete/DeleteRealEstateListingResponseDTO';
import { ReadRealEstateListingResponseDTO } from '../../contracts/realEstateListings/read/ReadRealEstateListingResponseDTO';
import { UpdateRealEstateListingRequestDTO } from '../../contracts/realEstateListings/update/UpdateRealEstateListingRequestDTO';
import { UpdateRealEstateListingResponseDTO } from '../../contracts/realEstateListings/update/UpdateRealEstateListingResponseDTO';
import { ListRealEstateListingsRequestDTO } from '../../contracts/realEstateListings/list/ListRealEstateListingsRequestDTO';
import { ListRealEstateListingsResponseDTO } from '../../contracts/realEstateListings/list/ListRealEstateListingsResponseDTO';
import { DeleteManyRealEstateListingsRequestDTO } from '../../contracts/realEstateListings/deleteMany/DeleteManyRealEstateListingsRequestDTO';

@Injectable({
    providedIn: 'root',
})
export class RealEstateListingDataAccessService {
    private readonly baseUrl = `${environment.apiUrl}/api/real-estate-listings`;
    constructor(private http: HttpClient) {}

    create(request: CreateRealEstateListingRequestDTO) {
        return this.http.post<CreateRealEstateListingResponseDTO>(`${this.baseUrl}/create`, request);
    }

    delete(id: string, request: DeleteRealEstateListingRequestDTO) {
        return this.http.delete<DeleteRealEstateListingResponseDTO>(`${this.baseUrl}/${id}/delete`, { body: request });
    }

    deleteMany(request: DeleteManyRealEstateListingsRequestDTO) {
        const url = urlWithQuery(`${this.baseUrl}/delete`, request)
        return this.http.delete<DeleteRealEstateListingResponseDTO>(url);
    }

    list(request: ListRealEstateListingsRequestDTO) {
        const url = urlWithQuery(`${this.baseUrl}`, request);
        return this.http.get<ListRealEstateListingsResponseDTO>(url);
    }

    read(id: string) {
        return this.http.get<ReadRealEstateListingResponseDTO>(`${this.baseUrl}/${id}`);
    }

    update(id: string, request: UpdateRealEstateListingRequestDTO) {
        return this.http.put<UpdateRealEstateListingResponseDTO>(`${this.baseUrl}/${id}/update`, request);
    }
}
