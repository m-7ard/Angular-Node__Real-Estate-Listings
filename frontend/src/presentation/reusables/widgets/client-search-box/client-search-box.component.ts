import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { PopoverModule, Popover } from 'primeng/popover';
import { Subject, Observable, of, debounceTime, switchMap, map, catchError, EMPTY } from 'rxjs';
import ApiModelMappers from '../../../mappers/ApiModelMappers';
import Client from '../../../models/Client';
import { ClientDataAccessService } from '../../../services/data-access/client-data-access.service';
import { ExceptionNoticeService } from '../../../services/exception-notice.service';
import { PanelSectionDirective } from '../../panel/panel-section.directive';
import { PrimeNgPopoverDirective } from '../../prime-ng-popover/prime-ng-popover.directive';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';
import { CharFieldComponent } from '../char-field/char-field.component';
import { PanelDirective } from '../../panel/panel.directive';
import { DividerComponent } from '../../divider/divider.component';

@Component({
    selector: 'app-client-search-box',
    standalone: true,
    imports: [
        PrimeNgPopoverDirective,
        MixinStyledButtonDirective,
        PopoverModule,
        CommonModule,
        CharFieldComponent,
        PanelSectionDirective,
        PanelDirective,
        DividerComponent,
    ],
    templateUrl: './client-search-box.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ClientSearchBoxComponent),
            multi: true,
        },
    ],
})
export class ClientSearchBoxComponent implements ControlValueAccessor, OnInit {
    @Input() value: Client | null = null;
    @ViewChild('op') op!: Popover;

    searchTerm = '';
    searchSubject = new Subject<string>();
    clients$: Observable<Client[]> = of([]);

    constructor(
        private readonly clientDataAccess: ClientDataAccessService,
        private readonly exceptionNoticeService: ExceptionNoticeService,
    ) {
        this.clients$ = this.searchSubject.pipe(
            debounceTime(300),
            switchMap((query) =>
                query
                    ? this.clientDataAccess
                          .list({ name: query })
                          .pipe(map((dto) => dto.clients.map(ApiModelMappers.clientApiModelToDomain)))
                    : of([]),
            ),
            catchError((err: HttpErrorResponse) => {
                this.exceptionNoticeService.dispatchError(new Error(JSON.stringify(err.message)));
                return EMPTY;
            }),
        );
    }

    ngOnInit(): void {
    }

    onHide() {
        this.searchTerm = this.value == null ? "" : this.value.name; 
        this.searchSubject.next(this.searchTerm);
    }

    onSearch(event: Event) {
        this.op.show(event);
        const input = event.target as HTMLInputElement;
        this.searchTerm = input.value;
        this.searchSubject.next(this.searchTerm);
    }

    onFocus(event: FocusEvent) {
        this.op.show(event);
    }

    onPick(client: Client) {
        this.value = client;
        this.onChange(client);
        this.onTouched();
        this.searchTerm = client.name;
        this.op.hide();
    }

    // ControlValueAccessor methods
    writeValue(value: Client | null): void {
        this.value = value;
        this.searchTerm = value?.name ?? "";
    }

    registerOnChange(fn: (value: Client | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    private onChange(value: Client | null) {}
    private onTouched: () => void = () => {};
}
