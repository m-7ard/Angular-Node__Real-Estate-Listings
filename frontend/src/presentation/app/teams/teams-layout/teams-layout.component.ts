import { Component } from '@angular/core';
import { HeaderNavbarButtons, FormFieldComponent } from '../../../reusables/header-navbar/header-navbar.component';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContentGridDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';

@Component({
    selector: 'app-teams-layout',
    standalone: true,
    imports: [
        RouterModule,
        MixinStyledCardDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
        PageDirectivesModule,
        CommonModule,
        FormFieldComponent,
    ],
    templateUrl: './teams-layout.component.html',
})
export class TeamsLayoutComponent {
    public readonly buttons: HeaderNavbarButtons = [
        { label: 'List', url: '/teams' },
        { label: 'Create', url: '/teams/create' },
    ];
}
