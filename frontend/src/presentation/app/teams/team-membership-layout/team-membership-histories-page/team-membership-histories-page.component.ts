import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { MatchElementComponent } from '../../../../reusables/model-elements/match-element/match-element.component';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { ITeamMembershipHistoriesPageResolverData } from './team-membership-histories-page.resolver';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import TeamMembershipHistory from '../../../../models/TeamMembershipHistory';
import { TeamMembershipHistoryElement } from "../../../../reusables/model-elements/team-membership-history-element/team-membership-history-element.component";
import TeamMembership from '../../../../models/TeamMembership';

@Component({
    selector: 'app-team-membership-histories-page',
    standalone: true,
    imports: [
    CommonModule,
    MixinStyledCardDirectivesModule,
    RouterModule,
    PageDirectivesModule,
    DividerComponent,
    ContentGridDirectivesModule,
    TeamMembershipHistoryElement
],
    templateUrl: './team-membership-histories-page.component.html',
})
export class TeamMembershipHistoriesPageComponent implements OnInit {
    public teamMembershipHistories!: TeamMembershipHistory[];
    public teamMembership!: TeamMembership;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit(): void {
        const data: ITeamMembershipHistoriesPageResolverData = this.activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.teamMembershipHistories = data.teamMembershipHistories;
        this.teamMembership = data.teamMembership;
    }
}
