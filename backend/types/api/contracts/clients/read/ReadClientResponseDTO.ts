export interface ReadClientResponseDTO {
    client: ClientAPIModel;
    [property: string]: any;
}

export interface ClientAPIModel {
    id:   string;
    name: string;
    type: string;
    [property: string]: any;
}
