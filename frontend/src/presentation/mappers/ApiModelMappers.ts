import { UserAPIModel } from "../contracts/users/currentUser/CurrentUserResponseDTO";
import User from "../models/User";

export default class ApiModelMappers {
    public static userApiModelToDomain(user: UserAPIModel): User {
        return new User({
            id: user.id,
            email: user.email,
            isAdmin: user.isAdmin,
            name: user.name
        })
    }
}