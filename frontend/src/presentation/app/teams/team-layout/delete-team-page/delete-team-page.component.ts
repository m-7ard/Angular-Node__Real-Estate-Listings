import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import IPresentationError from '../../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../../errors/PresentationErrorFactory';
import Team from '../../../../models/Team';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../../reusables/form-errors/form-errors';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { TeamDataAccessService } from '../../../../services/data-access/team-data-access.service';
import { ExceptionNoticeService } from '../../../../services/exception-notice.service';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import { ITeamLayoutPageResolverData } from '../team-layout-page.resolver';

@Component({
    selector: 'app-delete-team-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        FormErrorsComponent,
        PageDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
    ],
    templateUrl: './delete-team-page.component.html',
})
export class DeleteTeamPageComponent {
    errors: IPresentationError<{}> = {};

    team: Team = null!;

    constructor(
        private teamDataAccess: TeamDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        const data: ITeamLayoutPageResolverData = this.activatedRoute.snapshot.parent?.data[RESOLVER_DATA_KEY];

        this.team = data.team;
    }

    async onSubmit(e: Event) {
        e.preventDefault();

        this.teamDataAccess
            .delete(this.team.id, {})
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    if (err.status === 400) {
                        this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
                    } else {
                        this.exceptionNoticeService.dispatchError(new Error(JSON.stringify(err.message)));
                    }

                    return of(null);
                }),
            )
            .subscribe({
                next: (response) => {
                    if (response === null) {
                        return;
                    }

                    this.router.navigate([`/teams/`]);
                },
            });
    }
}
