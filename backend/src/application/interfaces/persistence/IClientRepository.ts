import Client from "domain/entities/Client";
import ClientId from "domain/valueObjects/Client/ClientId";

interface IClientRepository {
    createAsync: (client: Client) => Promise<void>;
    getByIdAsync: (id: ClientId) => Promise<Client | null>;
    updateAsync: (client: Client) => Promise<void>;
}

export default IClientRepository;
