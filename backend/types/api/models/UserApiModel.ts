export interface UserAPIModel {
    email:   string;
    id:      string;
    isAdmin: boolean;
    name:    string;
    [property: string]: any;
}
