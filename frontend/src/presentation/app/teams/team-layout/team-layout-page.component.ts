import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Team from '../../../models/Team';
import TeamPlayer from '../../../models/TeamPlayer';
import { ITeamLayoutPageResolverData } from './team-layout-page.resolver';
import { RESOLVER_DATA_KEY } from '../../../utils/RESOLVER_DATA';
import { MixinStyledCardDirectivesModule } from '../../../reusables/styled-card/styled-card.module';
import { DividerComponent } from '../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../reusables/page/page.directive.module';
import { ContentGridDirectivesModule } from '../../../reusables/content-grid/content-grid.directive.module';
import { CommonModule } from '@angular/common';
import { HeaderNavbarButtons, FormFieldComponent } from '../../../reusables/header-navbar/header-navbar.component';

@Component({
    selector: 'app-read-team-page',
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
    templateUrl: './team-layout-page.component.html',
})
export class TeamLayoutPageComponent implements OnInit {
    team!: Team;
    teamPlayers!: TeamPlayer[];
    public buttons!: HeaderNavbarButtons;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: ITeamLayoutPageResolverData = this.activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.team = data.team;
        this.teamPlayers = data.teamPlayers;

        this.buttons = [
            { label: 'Details', url: `/teams/${this.team.id}/` },
            { label: 'Memberships', url: `/teams/${this.team.id}/memberships` },
            { label: 'Update', url: `/teams/${this.team.id}/update` },
            { label: 'Create Membership', url: `/teams/${this.team.id}/memberships/add` },
            { label: 'Delete', url: `/teams/${this.team.id}/delete` },
        ];
    }
}
