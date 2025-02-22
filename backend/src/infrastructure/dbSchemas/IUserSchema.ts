export default interface IUserSchema {
    id: string;
    name: string;
    email: string;
    hashed_password: string;
    date_created: Date;
    is_admin: 1 | 0;
}
