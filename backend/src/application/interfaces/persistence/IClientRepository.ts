import Client from "domain/entities/Client";
import ClientId from "domain/valueObjects/Client/ClientId";
import ClientType from "domain/valueObjects/Client/ClientType";

export class FilterClientsCriteria {
    constructor(params: {
        id?: ClientId | null;
        type?: ClientType | null;
        name?: string | null;
    }) {
        this.id = params.id ?? null;
        this.type = params.type ?? null;
        this.name = params.name ?? null;
    }

    id: ClientId | null;
    type: ClientType | null;
    name: string | null;

    equal(other: unknown) {
        if (!(other instanceof FilterClientsCriteria)) return false;
        return (
            this.id?.equals(other.id) === true &&
            this.type?.equals(other.type) === true &&
            this.name === other.name
        )
    }
}

interface IClientRepository {
    createAsync: (client: Client) => Promise<void>;
    getByIdAsync: (id: ClientId) => Promise<Client | null>;
    updateAsync: (client: Client) => Promise<void>;
    deleteAsync: (client: Client) => Promise<void>;
    filterAsync: (criteria: FilterClientsCriteria) => Promise<Client[]>;
}

export default IClientRepository;
