import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import IPresentationError from '../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../errors/PresentationErrorFactory';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { FormErrorsComponent } from '../../../reusables/form-errors/form-errors';
import { FormFieldComponent } from '../../../reusables/form-field/form-field.component';
import { MixinStyledButtonDirective } from '../../../reusables/styled-button/styled-button.directive';
import { CharFieldComponent } from '../../../reusables/widgets/char-field/char-field.component';
import { AuthService } from '../../../services/auth-service';
import { ExceptionNoticeService } from '../../../services/exception-notice.service';
import { PageDirective } from '../../../reusables/page/page.directive';
import { PageSectionDirective } from '../../../reusables/page/page-section.directive';
import { ContentGridDirective } from '../../../reusables/content-grid/content-grid.directive';
import { ContentGridTrackDirective } from '../../../reusables/content-grid/content-grid-track.directive';

interface IFormControls {
    email: FormControl<string>;
    password: FormControl<string>;
    name: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    email: string[];
    password: string[];
    name: string[];
}>;

@Component({
    selector: 'app-register-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CharFieldComponent,
        FormFieldComponent,
        CommonModule,
        MixinStyledButtonDirective,
        FormErrorsComponent,
        PageDirective,
        PageSectionDirective,
        ContentGridDirective,
        ContentGridTrackDirective,
        DividerComponent,
    ],
    templateUrl: './register-page.component.html',
    hostDirectives: [ContentGridDirective],
})
export class RegisterUserPageComponent {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};

    constructor(
        private router: Router,
        private authService: AuthService,
        private exceptionNoticeService: ExceptionNoticeService,
    ) {
        this.form = new FormGroup<IFormControls>({
            email: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            password: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            name: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
        });
    }

    onReset(): void {
        this.form.reset({
            email: '',
            password: '',
            name: '',
        });
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.authService
            .register({
                email: rawValue.email,
                password: rawValue.password,
                name: rawValue.name,
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

                    this.router.navigate(['/users/login']);
                },
            });
    }
}
