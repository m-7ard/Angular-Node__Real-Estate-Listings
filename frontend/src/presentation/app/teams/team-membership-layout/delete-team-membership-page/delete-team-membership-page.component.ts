import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../../reusables/form-errors/form-errors';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import IPresentationError from '../../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../../errors/PresentationErrorFactory';
import { TeamDataAccessService } from '../../../../services/data-access/team-data-access.service';
import { ExceptionNoticeService } from '../../../../services/exception-notice.service';
import { ITeamMembershipLayoutPageResolverData } from '../team-membership-layout.resolver';
import { ActivatedRoute, Router } from '@angular/router';
import Team from '../../../../models/Team';
import TeamPlayer from '../../../../models/TeamPlayer';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';

@Component({
    selector: 'app-delete-team-membership-page',
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
    templateUrl: './delete-team-membership-page.component.html',
})
export class DeleteTeamMembershipPageComponent implements OnInit {
    errors: IPresentationError<{}> = {};

    team: Team = null!;
    teamPlayer: TeamPlayer = null!;

    constructor(
        private teamDataAccess: TeamDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        const data: ITeamMembershipLayoutPageResolverData =
            this.activatedRoute.snapshot.parent?.data[RESOLVER_DATA_KEY];
        const teamPlayer = data.teamPlayer;

        this.teamPlayer = teamPlayer;
        this.team = data.team;
    }

    async onSubmit(e: Event) {
        e.preventDefault();
        const membership = this.teamPlayer.membership;

        this.teamDataAccess
            .deleteTeamMembership(membership.teamId, membership.id, {})
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

                    this.router.navigate([`/teams/${this.team.id}/memberships`]);
                },
            });
    }
}
