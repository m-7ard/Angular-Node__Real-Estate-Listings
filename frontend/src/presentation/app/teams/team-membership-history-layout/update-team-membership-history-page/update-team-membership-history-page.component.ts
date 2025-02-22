import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../../errors/PresentationErrorFactory';
import Team from '../../../../models/Team';
import { CharFieldComponent } from '../../../../reusables/char-field/char-field.component';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../../reusables/form-errors/form-errors';
import { FormFieldComponent } from '../../../../reusables/form-field/form-field.component';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { TeamDataAccessService } from '../../../../services/data-access/team-data-access.service';
import parsers from '../../../../utils/parsers';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import { ITeamLayoutPageResolverData } from '../../team-layout/team-layout-page.resolver';
import IPresentationError from '../../../../errors/IPresentationError';
import TeamMembership from '../../../../models/TeamMembership';
import TeamMembershipHistory from '../../../../models/TeamMembershipHistory';
import { PlayerPositionSingleton } from '../../../../services/player-position-singleton.service';
import { date, max, min, number, object, string } from 'superstruct';
import validateSuperstruct from '../../../../utils/validateSuperstuct';
import structErrorToPresentationError from '../../../../utils/structErrorToPresentationError';
import { SelectComponent } from '../../../../reusables/select/select.component';
import { ITeamMembershipHistoryLayoutResolverData } from '../team-membership-history-layout.resolver';

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
    selector: 'app-update-team-membership-history-page',
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
        PageDirectivesModule,
        ContentGridDirectivesModule,
        SelectComponent,
    ],
    templateUrl: './update-team-membership-history-page.component.html',
})
export class UpdateTeamMembershipHistoryPageComponent {
    form: FormGroup<IFormControls> = null!;
    errors: IErrorSchema = {};

    team: Team = null!;
    teamMembership: TeamMembership = null!;
    teamMembershipHistory: TeamMembershipHistory = null!;

    dateEffectiveFromHelperText: string[] = null!;

    private get initialData() {
        return {
            dateEffectiveFrom: parsers.parseJsDateToInputDatetimeLocal(this.teamMembershipHistory.dateEffectiveFrom),
            number: this.teamMembershipHistory.number.toString(),
            position: this.teamMembershipHistory.position.value,
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
        const data: ITeamMembershipHistoryLayoutResolverData =
            this.activatedRoute.snapshot.parent!.data[RESOLVER_DATA_KEY];
        this.team = data.team;
        this.teamMembership = data.teamPlayer.membership;
        this.teamMembershipHistory = data.teamMembershipHistory;

        this.form.patchValue(this.initialData);

        this.dateEffectiveFromHelperText = [
            `Must be greater or equal than Team Membership's active from date (${this.teamMembership.activeFrom})`,
        ];

        if (this.teamMembership.activeTo != null) {
            this.dateEffectiveFromHelperText.push(
                `Must be less than Team Membership's active to date (${this.teamMembership.activeTo})`,
            );
        }
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
            .updateTeamMembershipHistory(this.team.id, this.teamMembership.id, this.teamMembershipHistory.id, {
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
                        `/teams/${this.team.id}/memberships/${this.teamMembership.id}/histories/${this.teamMembershipHistory.id}`,
                    ]);
                },
            });
    }

    onReset(event: Event): void {
        event.preventDefault();
        this.form.reset(this.initialData);
    }
}
