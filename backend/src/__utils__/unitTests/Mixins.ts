import User from "domain/entities/User";

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

}

export default Mixins;
