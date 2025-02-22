import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ExceptionNoticeService {
    private errorSubject = new BehaviorSubject<Error | null>(null);
    public error$ = this.errorSubject.asObservable();

    dispatchError(error: Error): void {
        this.errorSubject.next(error);
    }

    clearError(): void {
        this.errorSubject.next(null);
    }
}