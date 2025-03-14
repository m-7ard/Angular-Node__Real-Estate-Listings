export default class User {
    constructor(params: {
        id: string;
        email: string;
        isAdmin: boolean;
        name: string;
    }) {
        this.id = params.id;
        this.email = params.email;
        this.isAdmin = params.isAdmin;
        this.name = params.name;
    }

    public id: string;
    public email: string;
    public isAdmin: boolean;
    public name: string;
}