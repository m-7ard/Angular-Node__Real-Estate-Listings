export interface CurrentUserResponseDTO {
    user: UserAPIModel | null;
}

export interface UserAPIModel {
    email:   string;
    id:      string;
    isAdmin: boolean;
    name:    string;
}
