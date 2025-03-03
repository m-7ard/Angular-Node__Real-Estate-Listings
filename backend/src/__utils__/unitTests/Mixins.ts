import Client from "domain/entities/Client";
import User from "domain/entities/User";
import ClientType from "domain/valueObjects/Client/ClientType";

class Mixins {
    static createUser(seed: number, isAdmin: boolean) {
        const password = `hashed_password_${seed}`;
        const user = User.executeCreate({
            id: `${seed}`,
            name: `user_${seed}`,
            email: `user_${seed}@email.com`,
            hashedPassword: password,
            isAdmin: isAdmin,
            dateCreated: new Date()
        });

        return { user, password };
    }

    static createClient(seed: number) {
        const client = Client.executeCreate({
            id: `${seed}`,
            name: `client_${seed}`,
            type: ClientType.PRIVATE.value
        });

        return client
    }
}

export default Mixins;
