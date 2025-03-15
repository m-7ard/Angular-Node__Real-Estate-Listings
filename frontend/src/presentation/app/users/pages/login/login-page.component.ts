import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import IPresentationError from '../../../../errors/IPresentationError';
import PresentationErrorFactory from '../../../../errors/PresentationErrorFactory';
import { AuthService } from '../../../../services/auth-service';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../../../../reusables/form-field/form-field.component';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { FormErrorsComponent } from '../../../../reusables/form-errors/form-errors';
import { ExceptionNoticeService } from '../../../../services/exception-notice.service';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { PageDirective } from '../../../../reusables/page/page.directive';
import { PageSectionDirective } from '../../../../reusables/page/page-section.directive';
import { ContentGridDirective } from '../../../../reusables/content-grid/content-grid.directive';
import { CharFieldComponent } from '../../../../reusables/widgets/char-field/char-field.component';

interface IFormControls {
    email: FormControl<string>;
    password: FormControl<string>;
}

type IErrorSchema = IPresentationError<{
    email: string[];
    password: string[];
}>;

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CharFieldComponent,
        FormFieldComponent,
        CommonModule,
        MixinStyledButtonDirective,
        FormErrorsComponent,
        DividerComponent,
        PageDirective,
        PageSectionDirective,
    ],
    templateUrl: './login-page.component.html',
    hostDirectives: [ContentGridDirective]
})
export class LoginUserPageComponent {
    form: FormGroup<IFormControls>;
    errors: IErrorSchema = {};

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
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
        });
    }

    onReset(): void {
        this.form.reset({
            email: '',
            password: '',
        });
    }

    onSubmit(): void {
        const rawValue = this.form.getRawValue();

        this.authService
            .login({
                email: rawValue.email,
                password: rawValue.password,
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
                next: (user) => {
                    const nextUrl = this.activatedRoute.snapshot.queryParams['next'] || '/';
                    this.router.navigate([nextUrl]);
                },
                error: () => {
                    // Error already handled in catchError
                },
            });
    }
}
