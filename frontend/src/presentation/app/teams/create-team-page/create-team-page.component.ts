import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CharFieldComponent } from '../../../reusables/char-field/char-field.component';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { Router } from '@angular/router';
import { TeamDataAccessService } from '../../../services/data-access/team-data-access.service';
import { CommonModule } from '@angular/common';
import IPresentationError from '../../../errors/IPresentationError';
import { catchError, of } from 'rxjs';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { HttpErrorResponse } from '@angular/common/http';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { ExceptionNoticeService } from '../../../services/exception-notice.service';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { ContentGridDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';

interface IFormControls {
    name: FormControl<string>;
    dateFounded: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    dateFounded: string[];
    name: string[];
}>;

@Component({
    selector: 'app-create-team-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CharFieldComponent,
        FormFieldComponent,
        CommonModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        FormErrorsComponent,
        PageDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
    ],
    templateUrl: './create-team-page.component.html',
})
export class CreateTeamPageComponent implements OnInit {
    form!: FormGroup<IFormControls>;
    errors: IErrorSchema = {};

    constructor(
        private router: Router,
        private teamDataAccess: TeamDataAccessService,
        private exceptionNoticeService: ExceptionNoticeService,
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup<IFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            dateFounded: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        const requestObserver = this.teamDataAccess.createTeam({
            dateFounded: new Date(rawValue.dateFounded),
            name: rawValue.name,
        });

        requestObserver
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
                next: (body) => {
                    if (body == null) {
                        return;
                    }

                    this.router.navigate(['/teams']);
                },
            });
    }

    onReset(): void {
        this.form.reset({
            dateFounded: '',
            name: '',
        });
    }
}
