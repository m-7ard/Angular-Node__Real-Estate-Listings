import RoutableException from './RoutableException';

class InternalServerErrorException extends RoutableException {
    constructor(message: string) {
        super(message, '/internal-server-error/');
    }
}

export default InternalServerErrorException;