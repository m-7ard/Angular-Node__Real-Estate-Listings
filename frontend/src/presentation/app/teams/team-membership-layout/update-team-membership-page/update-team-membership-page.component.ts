import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import IPresentationError from '../../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../../errors/PresentationErrorFactory';
import { TeamDataAccessService } from '../../../../services/data-access/team-data-access.service';
import parsers from '../../../../utils/parsers';
import { IUpdateTeamMembershipResolverData } from './update-team-membership-page.resolver';
import { CharFieldComponent } from '../../../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../../../reusables/form-field/form-field.component';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import TeamPlayer from '../../../../models/TeamPlayer';
import Team from '../../../../models/Team';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import { FormErrorsComponent } from '../../../../reusables/form-errors/form-errors';
import { CommonModule } from '@angular/common';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { ITeamMembershipLayoutPageResolverData } from '../team-membership-layout.resolver';

interface IFormControls {
    activeFrom: FormControl<string>;
    activeTo: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    activeFrom: string[];
    activeTo: string[];
}>;

@Component({
    selector: 'app-update-team-membership-page',
    standalone: true,
    imports: [
        FormFieldComponent,
        CharFieldComponent,
        ReactiveFormsModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        FormErrorsComponent,
        CommonModule,
        DividerComponent,
        ContentGridDirectivesModule,
        PageDirectivesModule,
    ],
    templateUrl: './update-team-membership-page.component.html',
})
export class UpdateTeamMembershipPageComponent {
    form: FormGroup<IFormControls> = null!;
    errors: IErrorSchema = {};

    teamId: string = null!;
    team: Team = null!;
    teamPlayer: TeamPlayer = null!;
    teamMembershipId: string = null!;

    public activeDatesHelperTexts!: string[];

    private get initialData() {
        const membership = this.teamPlayer.membership;

        return {
            activeFrom: parsers.parseJsDateToInputDatetimeLocal(membership.activeFrom),
            activeTo: membership.activeTo == null ? '' : parsers.parseJsDateToInputDatetimeLocal(membership.activeTo),
        };
    }

    constructor(
        private router: Router,
        private teamDataAccess: TeamDataAccessService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.form = new FormGroup<IFormControls>({
            activeFrom: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            activeTo: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    ngOnInit() {
        const data: ITeamMembershipLayoutPageResolverData = this.activatedRoute.snapshot.parent?.data[RESOLVER_DATA_KEY];

        this.teamId = data.team.id;
        this.teamMembershipId = data.teamPlayer.player.id;

        const teamPlayer = data.teamPlayer;

        this.teamPlayer = teamPlayer;
        this.team = data.team;

        this.form.patchValue(this.initialData);

        this.activeDatesHelperTexts = [`Must be greater than Team's date founded (${this.team.dateFounded})`];
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.teamDataAccess
            .updateTeamMembership(this.teamId, this.teamMembershipId, {
                activeFrom: new Date(rawValue.activeFrom),
                activeTo: rawValue.activeTo === '' ? null : new Date(rawValue.activeTo),
            })
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    this.errors = PresentationErrorFactory.ApiErrorsToPresentationErrors(err.error);
                    return of(null);
                }),
            )
            .subscribe({
                next: (response) => {
                    if (response === null) {
                        return;
                    }
                    this.router.navigate([`/teams/${this.teamId}/players`]);
                },
            });
    }

    onReset(event: Event): void {
        event.preventDefault();
        this.form.reset(this.initialData);
    }
}
