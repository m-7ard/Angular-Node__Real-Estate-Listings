export default class Client {
    private __type: 'CLIENT' = null!;

    constructor(params: { 
        id:   string;
        name: string;
        type: string;
     }) {
        this.id = params.id;
        this.name = params.name;
        this.type = params.type;
    }

    public id:   string;
    public name: string;
    public type: string;
}
