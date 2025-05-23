import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import Client from '../../../models/Client';
import { CheckboxComponent } from '../../widgets/checkbox/checkbox.component';
import { StaticDataResponseDTO } from '../../../contracts/other/static-data/StaticDataResponseDTO';
import { StaticApiDataService } from '../../../services/static-api-data-service';
import { MixinStyledButtonDirective } from '../../styled-button/styled-button.directive';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { DividerComponent } from '../../divider/divider.component';
import { PanelSectionDirective } from '../../panel/panel-section.directive';
import { PanelDirective } from '../../panel/panel.directive';
import { PrimeNgPopoverDirective } from '../../prime-ng-popover/prime-ng-popover.directive';

@Component({
    selector: 'app-client',
    standalone: true,
    imports: [
        CommonModule,
        CheckboxComponent,
        PopoverModule,
        PanelDirective,
        PanelSectionDirective,
        MixinStyledButtonDirective,
        DividerComponent,
        CommonModule,
        RouterModule,
        PrimeNgPopoverDirective
    ],
    templateUrl: './client.component.html',
})
export class ClientComponent {
    @Input() client: Client = null!;
    @Input() selected: boolean = false;
    @Output() select = new EventEmitter<Client>();
    clientTypeOptions: StaticDataResponseDTO['clientTypes'];

    constructor(private readonly staticApiDataService: StaticApiDataService) {
        this.clientTypeOptions = staticApiDataService.getOptions().clientTypes;
    }
}
