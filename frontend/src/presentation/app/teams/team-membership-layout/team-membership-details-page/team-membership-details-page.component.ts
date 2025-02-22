import { Component, OnInit } from '@angular/core';
import { ITeamMembershipLayoutPageResolverData } from '../team-membership-layout.resolver';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import { ActivatedRoute, RouterModule } from '@angular/router';
import TeamPlayer from '../../../../models/TeamPlayer';
import { CommonModule } from '@angular/common';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { TeamMembershipHistoryElement } from '../../../../reusables/model-elements/team-membership-history-element/team-membership-history-element.component';

@Component({
    selector: 'app-team-membership-details-page',
    standalone: true,
    imports: [
        CommonModule,
        MixinStyledCardDirectivesModule,
        RouterModule,
        PageDirectivesModule,
        DividerComponent,
        ContentGridDirectivesModule,
        TeamMembershipHistoryElement,
    ],
    templateUrl: './team-membership-details-page.component.html',
})
export class TeamMembershipDetailsPageComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {}

    teamPlayer!: TeamPlayer;

    ngOnInit(): void {
        const data: ITeamMembershipLayoutPageResolverData = this.activatedRoute.snapshot.parent!.data[RESOLVER_DATA_KEY];
        this.teamPlayer = data.teamPlayer;
    }
}
