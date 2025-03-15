export default class RealEstateListing {
    private __type: "REAL_ESTATE_LISTING" = null!;

    constructor(params: {
        city: string;
        clientId: string;
        country: string;
        dateCreated: Date;
        id: string;
        price: number;
        state: string;
        street: string;
        type: string;
        zip: string;
    }) {
        this.city = params.city;
        this.clientId = params.clientId;
        this.country = params.country;
        this.dateCreated = params.dateCreated;
        this.id = params.id;
        this.price = params.price;
        this.state = params.state;
        this.street = params.street;
        this.type = params.type;
        this.zip = params.zip;
    }

    public city: string;
    public clientId: string;
    public country: string;
    public dateCreated: Date;
    public id: string;
    public price: number;
    public state: string;
    public street: string;
    public type: string;
    public zip: string;
}
