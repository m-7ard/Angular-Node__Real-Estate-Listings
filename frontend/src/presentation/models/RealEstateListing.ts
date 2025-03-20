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
        title: string;
        squareMeters: number;
        yearBuilt: number;
        bathroomNumber: number;
        bedroomNumber: number;
        description: string;
        flooringType: string;
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
        
        this.title = params.title;
        this.squareMeters = params.squareMeters;
        this.yearBuilt = params.yearBuilt;
        this.bathroomNumber = params.bathroomNumber;
        this.bedroomNumber = params.bedroomNumber;
        this.description = params.description;
        this.flooringType = params.flooringType;
        
    }

    public title: string;
    public squareMeters: number;
    public yearBuilt: number;
    public bathroomNumber: number;
    public bedroomNumber: number;
    public description: string;
    public flooringType: string;


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
