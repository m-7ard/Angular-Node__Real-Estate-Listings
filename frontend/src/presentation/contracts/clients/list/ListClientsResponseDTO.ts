export interface ListClientsResponseDTO {
    clients: ClientAPIModel[];
}

export interface ClientAPIModel {
    id:   string;
    name: string;
    type: string;
}
