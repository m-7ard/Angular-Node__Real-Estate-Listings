import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { StaticDataResponseDTO } from '../contracts/other/static-data/StaticDataResponseDTO';
import { ExceptionNoticeService } from './exception-notice.service';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class StaticApiDataService {
    private optionsSubject = new BehaviorSubject<StaticDataResponseDTO | null>(null);
    private options$: Observable<StaticDataResponseDTO | null> = this.optionsSubject.asObservable();

    constructor(
        private http: HttpClient,
        private exceptionNoticeService: ExceptionNoticeService,
    ) {}

    getOptions(): StaticDataResponseDTO {
        const value = this.optionsSubject.value;
        if (value == null) throw new Error("Options are null.");
        return value;
    }

    loadData(): Observable<StaticDataResponseDTO | null> {
        if (this.optionsSubject.value !== null) {
            return this.options$;
        }

        return this.http
            .get<StaticDataResponseDTO>(`${environment.apiUrl}/api/static-data`)
            .pipe(
                tap((options) => {
                    this.optionsSubject.next(options);
                }),
                catchError((err) => {
                    this.exceptionNoticeService.dispatchError(new Error(JSON.stringify(err.message)));
                    return EMPTY;
                }),
            );
    }
}