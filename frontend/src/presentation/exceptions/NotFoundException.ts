import RoutableException from './RoutableException';

class NotFoundException extends RoutableException {
    constructor(message: string) {
        super(message, '/not-found/');
    }
}

export default NotFoundException;