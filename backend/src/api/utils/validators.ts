import Ajv from "ajv";
import addFormats from "ajv-formats"

import CreateClientRequestDTO from "../../../schemas/api/contracts/clients/create/CreateClientRequestDTO.json";
import UpdateClientRequestDTO from "../../../schemas/api/contracts/clients/update/UpdateClientRequestDTO.json";
import DeleteClientRequestDTO from "../../../schemas/api/contracts/clients/delete/DeleteClientRequestDTO.json";

import CreateRealEstateListingRequestDTO from "../../../schemas/api/contracts/realEstateListings/create/CreateRealEstateListingRequestDTO.json";
import UpdateRealEstateListingRequestDTO from "../../../schemas/api/contracts/realEstateListings/update/UpdateRealEstateListingRequestDTO.json";
import DeleteManyRealEstateListingsRequestDTO from "../../../schemas/api/contracts/realEstateListings/deleteMany/DeleteManyRealEstateListingsRequestDTO.json";

import LoginUserRequestDTO from "../../../schemas/api/contracts/users/login/LoginUserRequestDTO.json";
import RegisterUserRequestDTO from "../../../schemas/api/contracts/users/register/RegisterUserRequestDTO.json";


const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Users
export const LoginUserRequestDTOValidator = ajv.compile(LoginUserRequestDTO);
export const RegisterUserRequestDTOValidator = ajv.compile(RegisterUserRequestDTO);

// Clients
export const CreateClientRequestDTOValidator = ajv.compile(CreateClientRequestDTO);
export const UpdateClientRequestDTOValidator = ajv.compile(UpdateClientRequestDTO);
export const DeleteClientRequestDTOValidator = ajv.compile(DeleteClientRequestDTO);

// Real Estate Listings
export const CreateRealEstateListingRequestDTOValidator = ajv.compile(CreateRealEstateListingRequestDTO);
export const UpdateRealEstateListingRequestDTOValidator = ajv.compile(UpdateRealEstateListingRequestDTO);
export const DeleteManyRealEstateListingsRequestDTOValidator = ajv.compile(DeleteManyRealEstateListingsRequestDTO);
