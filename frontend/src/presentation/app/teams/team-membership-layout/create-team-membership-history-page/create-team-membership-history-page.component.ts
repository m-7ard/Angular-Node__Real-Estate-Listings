import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import IPresentationError from '../../../../errors/IPresentationError';
import { CommonModule } from '@angular/common';
import { CharFieldComponent } from '../../../../reusables/char-field/char-field.component';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../../reusables/form-errors/form-errors';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { SelectComponent } from '../../../../reusables/select/select.component';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../../errors/PresentationErrorFactory';
import Team from '../../../../models/Team';
import { TeamDataAccessService } from '../../../../services/data-access/team-data-access.service';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import { ITeamMembershipHistoryLayoutResolverData } from '../../team-membership-history-layout/team-membership-history-layout.resolver';
import { object, date, string, number, max, min } from 'superstruct';
import TeamMembership from '../../../../models/TeamMembership';
import TeamMembershipHistory from '../../../../models/TeamMembershipHistory';
import { PlayerPositionSingleton } from '../../../../services/player-position-singleton.service';
import parsers from '../../../../utils/parsers';
import structErrorToPresentationError from '../../../../utils/structErrorToPresentationError';
import validateSuperstruct from '../../../../utils/validateSuperstuct';
import { FormFieldComponent } from '../../../../reusables/form-field/form-field.component';
import { ITeamMembershipLayoutPageResolverData } from '../team-membership-layout.resolver';

interface IFormControls {
    dateEffectiveFrom: FormControl<string>;
    number: FormControl<string>;
    position: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    dateEffectiveFrom: string[];
    number: string[];
    position: string[];
}>;

const validator = object({
    dateEffectiveFrom: date(),
    number: min(max(number(), 11), 1),
    position: string(),
});

@Component({
    selector: 'app-create-team-membership-history-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        CharFieldComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        PageDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
        FormErrorsComponent,
        SelectComponent,
        FormFieldComponent,
    ],
    templateUrl: './create-team-membership-history-page.component.html',
})
export class CreateTeamMembershipHistoryPageComponent {
    form: FormGroup<IFormControls> = null!;
    errors: IErrorSchema = {};

    team: Team = null!;
    teamMembership: TeamMembership = null!;

    public dateEffectiveFromHelperTexts!: string[];

    private get initialData() {
        return {
            dateEffectiveFrom: '',
            number: '',
            position: '',
        };
    }

    constructor(
        private router: Router,
        private teamDataAccess: TeamDataAccessService,
        private activatedRoute: ActivatedRoute,
        readonly playerPositionSingleton: PlayerPositionSingleton,
    ) {
        this.form = new FormGroup<IFormControls>({
            dateEffectiveFrom: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            number: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            position: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    ngOnInit() {
        const data: ITeamMembershipLayoutPageResolverData = this.activatedRoute.snapshot.parent!.data[RESOLVER_DATA_KEY];
        this.team = data.team;
        this.teamMembership = data.teamPlayer.membership;

        this.dateEffectiveFromHelperTexts = [
            this.teamMembership.activeTo == null
                ? `DateEffectiveFrom must be greater or equal than Team Membership's active from date (${this.teamMembership.activeFrom})`
                : `DateEffectiveFrom must be within the range of the TeamMembership's active from date (${this.teamMembership.activeFrom}) and active to date (${this.teamMembership.activeTo})`,
        ];
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();
        const validation = validateSuperstruct(
            {
                dateEffectiveFrom: new Date(rawValue.dateEffectiveFrom),
                number: parseInt(rawValue.number),
                position: rawValue.position,
            },
            validator,
        );

        if (validation.isErr()) {
            this.errors = structErrorToPresentationError(validation.error);
            return;
        }

        const data = validation.value;

        this.teamDataAccess
            .createTeamMembershipHistory(this.team.id, this.teamMembership.id, {
                dateEffectiveFrom: data.dateEffectiveFrom,
                number: data.number,
                position: data.position,
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
                    this.router.navigate([
                        `/teams/${response.teamId}/memberships/${response.teamMembershipId}/histories/${response.teamMembershipHistoryId}`,
                    ]);
                },
            });
    }

    onReset(event: Event): void {
        event.preventDefault();
        this.form.reset(this.initialData);
    }
}
