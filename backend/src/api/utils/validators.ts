import Ajv from "ajv";
import addFormats from "ajv-formats"

import CreateClientRequestDTO from "../../../schemas/api/contracts/clients/create/CreateClientRequestDTO.json";
import UpdateClientRequestDTO from "../../../schemas/api/contracts/clients/update/UpdateClientRequestDTO.json";
import DeleteClientRequestDTO from "../../../schemas/api/contracts/clients/delete/DeleteClientRequestDTO.json";

const ajv = new Ajv();
addFormats(ajv);

export const CreateClientRequestDTOValidator = ajv.compile(CreateClientRequestDTO);
export const UpdateClientRequestDTOValidator = ajv.compile(UpdateClientRequestDTO);
export const DeleteClientRequestDTOValidator = ajv.compile(DeleteClientRequestDTO);
