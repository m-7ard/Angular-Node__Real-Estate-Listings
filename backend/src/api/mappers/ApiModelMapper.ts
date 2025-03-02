import User from "domain/entities/User";
import { UserAPIModel } from "../../../types/api/models/UserApiModel";
import Client from "domain/entities/Client";
import { ClientAPIModel } from "../../../types/api/models/ClientApiModel";

class ApiModelMapper {
    public static createUserApiModel(user: User): UserAPIModel {
        return {
            id: user.id.value,
            email: user.email.value,
            name: user.name,
            isAdmin: user.isAdmin
        };
    }

    public static createClientApiModel(client: Client): ClientAPIModel {
        return {
            id: client.id.value,
            name: client.name,
            type: client.type.value
        }
    }
}

export default ApiModelMapper;
