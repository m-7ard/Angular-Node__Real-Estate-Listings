import Ajv from "ajv";
import addFormats from "ajv-formats"

import CreateClientRequestDTO from "../../../schemas/api/contracts/clients/create/CreateClientRequestDTO.json";

const ajv = new Ajv();
addFormats(ajv);

export const CreateClientRequestDTOValidator = ajv.compile(CreateClientRequestDTO);
