import IUserApiModel from "@apiModels/IUserApiModel";

interface ICurrentUserResponseDTO {
    user: IUserApiModel | null;
}

export default ICurrentUserResponseDTO;
