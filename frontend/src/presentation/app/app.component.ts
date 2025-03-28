import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { ExceptionNoticeService } from '../services/exception-notice.service';
import { ExceptionNoticePopover } from './other/exception-notice-popover.component';
import { DividerComponent } from '../reusables/divider/divider.component';
import { CharFieldComponent } from '../reusables/widgets/char-field/char-field.component';
import { CoverImageComponent } from '../reusables/cover-image/cover-image.component';
import { ListRealEstateListingsRequestDTO } from '../contracts/realEstateListings/list/ListRealEstateListingsRequestDTO';
import { SearchQueryService } from '../services/search-query-service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        RouterOutlet,
        CommonModule,
        ExceptionNoticePopover,
        DividerComponent,
        CharFieldComponent,
        CoverImageComponent,
    ],
    templateUrl: './app.component.html',
    host: {
        class: 'flex flex-col h-full',
    },
})
export class AppComponent implements OnInit {
    title = 'frontend';
    isAuthenticated: boolean = null!;
    error: Error | null = null;
    searchQuery: string;

    constructor(
        readonly authService: AuthService,
        readonly exceptionNoticeService: ExceptionNoticeService,
        private readonly router: Router,
        private readonly searchQueryService: SearchQueryService,
        private readonly activatedRoute: ActivatedRoute,
    ) {
        this.searchQuery = this.searchQueryService.searchQuery.value;
    }

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.authService.loadCurrentUser().subscribe();
            }
        });

        this.activatedRoute.queryParamMap.subscribe((params) => {
            const cityKey: keyof ListRealEstateListingsRequestDTO = 'city';
            this.searchQueryService.setSearchQuery(params.get(cityKey) ?? '');
        });

        this.authService.isAuthenticated$.subscribe((value) => {
            this.isAuthenticated = value;
        });

        this.exceptionNoticeService.error$.subscribe((value) => {
            this.error = value;
        });
    }

    onSearch(event: Event) {
        event.preventDefault();
        const cityKey: keyof ListRealEstateListingsRequestDTO = 'city';
        const query: ListRealEstateListingsRequestDTO = { [cityKey]: this.searchQuery };
        this.router.navigate(['/'], { queryParams: query });
    }

    onChange(value: string) {
        this.searchQuery = value;
    }
}
