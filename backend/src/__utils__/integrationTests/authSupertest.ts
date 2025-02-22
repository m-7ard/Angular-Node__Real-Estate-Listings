import User from "domain/entities/User";
import loginUser from "./loginUser";
import Test from "supertest/lib/test";
import Mixins from "./Mixins";

export async function adminSuperTest(props: { agent: Test; seed: number }): Promise<Test> {
    const { seed, agent } = props;
    const mixins = new Mixins();
    const { user, password } = await mixins.createUser(seed, true);
    const jwtToken = await loginUser(user, password);
    agent.set("Authorization", `Bearer ${jwtToken}`);
    return agent;
}

async function authSupertest(props: { user: User; plainPassword: string; agent: Test }): Promise<Test> {
    const { user, plainPassword, agent } = props;
    const jwtToken = await loginUser(user, plainPassword);
    agent.set("Authorization", `Bearer ${jwtToken}`);
    return agent;
}

export default authSupertest;
