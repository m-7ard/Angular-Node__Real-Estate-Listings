export interface RegisterUserRequestDTO {
    email:    string;
    name:     string;
    password: string;
    [property: string]: any;
}
