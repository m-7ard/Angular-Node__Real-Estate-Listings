import { Component, OnInit } from '@angular/core';
import { MixinStyledButtonDirective } from '../../../../../reusables/styled-button/styled-button.directive';
import { ExceptionNoticeService } from '../../../../../services/exception-notice.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageDirective } from '../../../../../reusables/page/page.directive';
import { PageSectionDirective } from '../../../../../reusables/page/page-section.directive';
import { RealEstateListingDataAccessService } from '../../../../../services/data-access/real-estate-listing-data-access.service';
import { catchError, EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import PresentationErrorFactory from '../../../../../errors/PresentationErrorFactory';
import RealEstateListing from '../../../../../models/RealEstateListing';
import { RESOLVER_DATA_KEY } from '../../../../../utils/RESOLVER_DATA';
import { IDeleteRealEstateListingsPageResolverData } from './delete-real-estate-listing-page.resolver';
import { FormErrorsComponent } from '../../../../../reusables/form-errors/form-errors';
import IPresentationError from '../../../../../errors/IPresentationError';

@Component({
    selector: 'app-delete-real-estate-listings-page',
    standalone: true,
    imports: [
        MixinStyledButtonDirective,
        CommonModule,
        PageDirective,
        PageSectionDirective,
        RouterModule,
        FormErrorsComponent,
    ],
    templateUrl: './delete-real-estate-listings-page.component.html',
})
export class DeleteRealEstateListingsPageComponent implements OnInit {
    errors: IPresentationError<object> = {};
    listings: RealEstateListing[] = null!;

    constructor(
        private readonly dataAccess: RealEstateListingDataAccessService,
        private readonly exceptionNoticeService: ExceptionNoticeService,
        private readonly router: Router,
        private readonly activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IDeleteRealEstateListingsPageResolverData;
            this.listings = data.listings;
        });
    }

    onSubmit(event: Event) {
        event.preventDefault();
        
        this.dataAccess
            .deleteMany({ ids: this.listings.map(({ id }) => id) })
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 400) {
                        this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
                    } else {
                        this.exceptionNoticeService.dispatchError(new Error(JSON.stringify(err.message)));
                    }

                    return EMPTY;
                }),
            )
            .subscribe({
                next: (response) => {
                    if (response === null) {
                        return;
                    }

                    this.router.navigate(['/admin/real-estate-listings']);
                },
            });
    }
}
