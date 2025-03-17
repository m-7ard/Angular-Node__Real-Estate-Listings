import User from "domain/entities/User";
import supertest from "supertest";
import { server } from "./integrationTest.setup";
import { LoginUserRequestDTO } from "../../../types/api/contracts/users/login/LoginUserRequestDTO";
import { LoginUserResponseDTO } from "../../../types/api/contracts/users/login/LoginUserResponseDTO";

export default async function loginUser(user: User, plainPassword: string): Promise<string> {
    const request: LoginUserRequestDTO = {
        email: user.email.value,
        password: plainPassword
    }

    const response = await supertest(server).post(`/api/users/login`).send(request).set("Content-Type", "application/json");
    if (!response.ok) {
        throw new Error("loginUser.ts failed to log in user.");
    }

    const body: LoginUserResponseDTO = response.body;

    if (body == null || body.token == null) {
        throw new Error("loginUser.ts response body or token is null.");
    }
    
    return body.token;
}