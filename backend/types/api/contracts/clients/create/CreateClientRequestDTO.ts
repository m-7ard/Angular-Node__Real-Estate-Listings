export interface CreateClientRequestDTO {
    ads?:   Client[];
    name:   string;
    userId: string;
    [property: string]: any;
}

export interface Client {
    description?: string;
    id:           string;
    price:        number;
    publishedAt?: Date;
    title:        string;
    [property: string]: any;
}
