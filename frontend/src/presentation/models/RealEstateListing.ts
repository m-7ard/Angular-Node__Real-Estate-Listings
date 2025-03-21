export default class RealEstateListing {
    private __type: "REAL_ESTATE_LISTING" = null!;

    constructor(params: {
        bathroomNumber: number;
        bedroomNumber: number;
        city: string;
        clientId: string;
        country: string;
        dateCreated: Date;
        description: string;
        flooringType: string;
        id: string;
        images: string[];
        price: number;
        squareMeters: number;
        state: string;
        street: string;
        title: string;
        type: string;
        yearBuilt: number;
        zip: string;
    }) {        
        this.bathroomNumber = params.bathroomNumber;
        this.bedroomNumber = params.bedroomNumber;
        this.city = params.city;
        this.clientId = params.clientId;
        this.country = params.country;
        this.dateCreated = params.dateCreated;
        this.description = params.description;
        this.flooringType = params.flooringType;
        this.id = params.id;
        this.images = params.images;
        this.price = params.price;
        this.squareMeters = params.squareMeters;
        this.state = params.state;
        this.street = params.street;
        this.title = params.title;
        this.type = params.type;
        this.yearBuilt = params.yearBuilt;
        this.zip = params.zip;
        
    }

    bathroomNumber: number;
    bedroomNumber: number;
    city: string;
    clientId: string;
    country: string;
    dateCreated: Date;
    description: string;
    flooringType: string;
    id: string;
    images: string[];
    price: number;
    squareMeters: number;
    state: string;
    street: string;
    title: string;
    type: string;
    yearBuilt: number;
    zip: string;

}
