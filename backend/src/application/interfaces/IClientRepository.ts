import Client from "domain/entities/Client";

interface IClientRepository {
    createAsync: (client: Client) => Promise<void>;
}

export default IClientRepository;
