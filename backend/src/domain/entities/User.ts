class User {
    private readonly __type: "USER_DOMAIN" = null!;

    constructor(props: { id: string; name: string; email: string; hashedPassword: string; dateCreated: Date; isAdmin: boolean }) {
        this.id = props.id;
        this.name = props.name;
        this.email = props.email;
        this.hashedPassword = props.hashedPassword;
        this.dateCreated = props.dateCreated;
        this.isAdmin = props.isAdmin;
    }

    public id: string;
    public name: string;
    public email: string;
    public hashedPassword: string;
    public dateCreated: Date;
    public isAdmin: boolean;
}

export default User;
