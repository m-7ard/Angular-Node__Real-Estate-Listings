import IApiModelService from "api/interfaces/IApiModelService";
import IClientRepository from "application/interfaces/persistence/IClientRepository";
import Client from "domain/entities/Client";

class ApiModelService implements IApiModelService {
    private readonly clientCache = new Map<Client["id"], Client | null>();

    constructor(
        private readonly clientRepository: IClientRepository,
    ) {}
}

export default ApiModelService;
