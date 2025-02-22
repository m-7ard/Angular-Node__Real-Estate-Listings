import RoutableException from './RoutableException';

class UnautorizedException extends RoutableException {
    constructor() {
        super("", '/users/login');
    }
}

export default UnautorizedException;