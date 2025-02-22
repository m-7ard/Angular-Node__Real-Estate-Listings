import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { ModalTriggerDirective } from '../reusables/modal/modal-trigger.directive';
import { DrawerModalComponent } from '../reusables/modal/example.component';
import { MixinStyledButtonDirective } from '../reusables/styled-button/styled-button.directive';
import { AuthService } from '../services/auth-service';
import { CommonModule } from '@angular/common';
import { ExceptionNoticeService } from '../services/exception-notice.service';
import { ExceptionNoticePopover } from './other/exception-notice-popover.component';
import { DividerComponent } from '../reusables/divider/divider.component';
import { ContentGridDirectivesModule } from '../reusables/content-grid/content-grid.directive.module';
import { PageDirectivesModule } from '../reusables/page/page.directive.module';
import { BreadcrumbComponent } from './elements/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterModule,
        ModalTriggerDirective,
        MixinStyledButtonDirective,
        CommonModule,
        ExceptionNoticePopover,
        DividerComponent,
        ContentGridDirectivesModule,
        PageDirectivesModule,
        BreadcrumbComponent,
    ],
    templateUrl: './app.component.html',
    host: {
        class: 'flex flex-col h-full',
    },
})
export class AppComponent implements OnInit {
    title = 'frontend';
    exampleModal = DrawerModalComponent;
    otherTitle = '0';
    isAuthenticated: boolean = null!;
    error: Error | null = null;
    @Input() topBarTemplate!: TemplateRef<any>;

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
