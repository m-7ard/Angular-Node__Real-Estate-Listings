import User from "domain/entities/User";
import supertest from "supertest";
import { server } from "./integrationTest.setup";
import ILoginUserRequestDTO from "api/DTOs/users/login/ILoginUserRequestDTO";
import ILoginUserResponseDTO from "api/DTOs/users/login/ILoginUserResponseDTO";

export default async function loginUser(user: User, plainPassword: string): Promise<string> {
    const request: ILoginUserRequestDTO = {
        email: user.email,
        password: plainPassword
    }

    const response = await supertest(server).post(`/api/users/login`).send(request).set("Content-Type", "application/json");
    if (!response.ok) {
        throw new Error("loginUser.ts failed to log in user.");
    }

    const body: ILoginUserResponseDTO = response.body;

    if (body == null || body.token == null) {
        throw new Error("loginUser.ts response body or token is null.");
    }
    
    return body.token;
}