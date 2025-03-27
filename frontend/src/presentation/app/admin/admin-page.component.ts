import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import IPresentationError from '../../errors/IPresentationError';

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
