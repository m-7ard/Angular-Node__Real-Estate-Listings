import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../../errors/PresentationErrorFactory';
import { TeamDataAccessService } from '../../../../services/data-access/team-data-access.service';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../../reusables/form-field/form-field.component';
import IPresentationError from '../../../../errors/IPresentationError';
import NotFoundException from '../../../../exceptions/NotFoundException';
import Player from '../../../../models/Player';
import { CharFieldComponent } from '../../../../reusables/char-field/char-field.component';
import { PickSinglePlayerComponent } from '../../../../reusables/pick-single-player/pick-single-player.component';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import Team from '../../../../models/Team';
import { ITeamLayoutPageResolverData } from '../team-layout-page.resolver';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import { ExceptionNoticeService } from '../../../../services/exception-notice.service';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../../reusables/form-errors/form-errors';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { SelectComponent } from '../../../../reusables/select/select.component';
import { PlayerPositionSingleton } from '../../../../services/player-position-singleton.service';

interface IFormControls {
    player: FormControl<Player | null>;
    activeFrom: FormControl<string>;
    activeTo: FormControl<string>;
    number: FormControl<string>;
    position: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    playerId: string[];
    activeFrom: string[];
    activeTo: string[];
    number: string[];
    position: string[];
}>;

@Component({
    selector: 'app-create-team-membership-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        FormFieldComponent,
        CharFieldComponent,
        PickSinglePlayerComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        PageDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
        FormErrorsComponent,
        SelectComponent,
    ],
    templateUrl: './create-team-membership-page.component.html',
})
export class CreateTeamMembershipPageComponent implements OnInit {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};
    id: string = null!;
    team: Team = null!;
    activeFromHelperText: string[] = null!;

    constructor(
        private readonly router: Router,
        private readonly teamDataAccess: TeamDataAccessService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly exceptionNoticeService: ExceptionNoticeService,
        readonly playerPositionSingleton: PlayerPositionSingleton
    ) {
        this.form = new FormGroup<IFormControls>({
            player: new FormControl(null, {
                nonNullable: false,
                validators: [Validators.required],
            }),
            activeFrom: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            activeTo: new FormControl('', {
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

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.parent!.paramMap.get('teamId');

        if (id == null) {
            throw new NotFoundException(`Team id in url is invalid. Url: ${id}`);
        }

        const data: ITeamLayoutPageResolverData = this.activatedRoute.snapshot.parent!.data[RESOLVER_DATA_KEY];
        this.team = data.team;

        this.id = id;
        this.activeFromHelperText = [`Must be greater than Team's date founded (${this.team.dateFounded})`];
    }

    onReset() {
        this.form.reset();
    }

    onSubmit() {
        const rawValue = this.form.getRawValue();

        this.teamDataAccess
            .createTeamMembership(this.id, {
                activeFrom: new Date(rawValue.activeFrom),
                activeTo: rawValue.activeTo === '' ? null : new Date(rawValue.activeTo),
                playerId: rawValue.player?.id as string,
                number: parseInt(rawValue.number),
                position: rawValue.position,
            })
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

                    this.router.navigate([`/teams/${this.id}/memberships`]);
                },
            });
    }
}
