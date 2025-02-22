export const ROUTABLE_EXCEPTION_TYPE = 'ROUTABLE_EXCEPTION';

class RoutableException extends Error {
    public readonly type = ROUTABLE_EXCEPTION_TYPE;

    constructor(message: string, route: string) {
        super(message);
        this.route = route;
        this.name = this.constructor.name;
    }

    public route: string;
}

export default RoutableException;
