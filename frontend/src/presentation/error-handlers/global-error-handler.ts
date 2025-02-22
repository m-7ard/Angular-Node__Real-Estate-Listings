import { Injectable, ErrorHandler } from '@angular/core';
import { ROUTABLE_EXCEPTION_TYPE } from '../exceptions/RoutableException';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private _router: Router) {}

    handleError(error: any): void {
        let errorMessage = 'An unexpected error occurred.';
        const errorType = error?.type;

        if (errorType === ROUTABLE_EXCEPTION_TYPE) {
            this._router.navigate([error.route], { state: { error: error.error } });
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = `Unknown error: ${JSON.stringify(error)}`;
        }

        console.error("error that was caught: ", error);
    }
}
