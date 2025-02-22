import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { MatchElementComponent } from '../../../../reusables/model-elements/match-element/match-element.component';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { ITeamMembershipHistoryLayoutResolverData } from '../team-membership-history-layout.resolver';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import TeamMembershipHistory from '../../../../models/TeamMembershipHistory';

@Component({
    selector: 'app-team-membership-history-details-page',
    standalone: true,
    imports: [
        CommonModule,
        MixinStyledCardDirectivesModule,
        RouterModule,
        PageDirectivesModule,
        DividerComponent,
        ContentGridDirectivesModule,
    ],
    templateUrl: './team-membership-history-details-page.component.html',
})
export class TeamMembershipHistoryDetailsPageComponent {
    teamMembershipHistory!: TeamMembershipHistory;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: ITeamMembershipHistoryLayoutResolverData = this.activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.teamMembershipHistory = data.teamMembershipHistory;
    }
}
