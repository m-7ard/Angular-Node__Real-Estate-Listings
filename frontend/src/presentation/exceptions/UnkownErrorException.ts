import RoutableException from './RoutableException';

class UnkownErrorException extends RoutableException {
    constructor() {
        super("", '/unkown-error/');
    }
}

export default UnkownErrorException;