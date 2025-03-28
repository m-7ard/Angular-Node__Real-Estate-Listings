import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { MixinStyledButtonDirective } from '../reusables/styled-button/styled-button.directive';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { ExceptionNoticeService } from '../services/exception-notice.service';
import { ExceptionNoticePopover } from './other/exception-notice-popover.component';
import { DividerComponent } from '../reusables/divider/divider.component';
import { CharFieldComponent } from '../reusables/widgets/char-field/char-field.component';
import { CoverImageComponent } from '../reusables/cover-image/cover-image.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        RouterOutlet,
        MixinStyledButtonDirective,
        CommonModule,
        ExceptionNoticePopover,
        DividerComponent,
        CharFieldComponent,
        CoverImageComponent,
    ],
    templateUrl: './app.component.html',
    host: {
        class: 'flex flex-col h-full',
    },
})
export class AppComponent implements OnInit {
    title = 'frontend';
    isAuthenticated: boolean = null!;
    error: Error | null = null;

    constructor(
        readonly authService: AuthService,
        readonly exceptionNoticeService: ExceptionNoticeService,
        private readonly router: Router,
    ) {}

    ngOnInit(): void {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.authService.loadCurrentUser().subscribe();
            }
        });

        this.authService.isAuthenticated$.subscribe((value) => {
            this.isAuthenticated = value;
        });

        this.exceptionNoticeService.error$.subscribe((value) => {
            this.error = value;
        });
    }
}
