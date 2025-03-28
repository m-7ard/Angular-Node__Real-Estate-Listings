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
export class SearchQueryService {
    searchQuery = new BehaviorSubject<string>('');
    searchQuery$ = this.searchQuery.asObservable();

    setSearchQuery(query: string) {
        this.searchQuery.next(query);
    }
}
