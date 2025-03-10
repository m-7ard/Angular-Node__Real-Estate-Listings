export interface ReadClientResponseDTO {
    client: ClientAPIModel;
}

export interface ClientAPIModel {
    id:   string;
    name: string;
    type: string;
}
