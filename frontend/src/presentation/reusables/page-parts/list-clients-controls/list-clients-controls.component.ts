import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';
import { Router, RouterModule } from '@angular/router';
import { ClientDataAccessService } from '../../../services/data-access/client-data-access.service';
import { ExceptionNoticeService } from '../../../services/exception-notice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY } from 'rxjs';
import Client from '../../../models/Client';

@Component({
    selector: 'app-list-clients-controls',
    standalone: true,
    imports: [MixinStyledButtonDirective, RouterModule],
    templateUrl: './list-clients-controls.component.html',
})
export class ListClientsControlsComponent {
    @Input() clients: Client[] = null!;
    @Input() toggleFilterMenu: () => void = null!;

    constructor(
        private readonly dataAccess: ClientDataAccessService,
        private readonly exceptionNoticeService: ExceptionNoticeService,
        private readonly router: Router,
    ) {}

    onFill(): void {
        for (let i = 0; i < 100; i++) {
            this.dataAccess
                .create({
                    name: `Client ${i}`,
                    type: "PRIVATE",
                })
                .pipe(
                    catchError((err: HttpErrorResponse) => {
                        this.exceptionNoticeService.dispatchError(new Error(JSON.stringify(err.message)));
                        return EMPTY;
                    }),
                )
                .subscribe({
                    next: (response) => {
                        if (response === null) {
                            return;
                        }

                        this.router.navigate([], { queryParams: { refresh: new Date().getTime() } });
                    },
                });
        }
    }
}
