import RoutableException from './RoutableException';

class ClientSideErrorException extends RoutableException {
    constructor(message: string) {
        super(message, '/client-side-error/');
    }
}

export default ClientSideErrorException;