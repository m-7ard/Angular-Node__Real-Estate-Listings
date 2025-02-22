import { define } from "superstruct";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const email = define<string>("email", (value, context) => {
    if (!(typeof value === "string")) {
        return false;
    }

    return emailRegex.test(value);
});

export default email;
