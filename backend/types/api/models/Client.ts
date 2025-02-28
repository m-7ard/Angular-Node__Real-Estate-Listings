export interface Client {
    description?: string;
    id:           string;
    price:        number;
    publishedAt?: Date;
    title:        string;
    [property: string]: any;
}
