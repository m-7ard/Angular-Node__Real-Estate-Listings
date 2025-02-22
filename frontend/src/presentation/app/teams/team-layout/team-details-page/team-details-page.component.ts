import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CoverImageComponent } from '../../../../reusables/cover-image/cover-image.component';
import Team from '../../../../models/Team';
import TeamPlayer from '../../../../models/TeamPlayer';
import { ITeamLayoutPageResolverData } from '../team-layout-page.resolver';
import { RESOLVER_DATA_KEY } from '../../../../utils/RESOLVER_DATA';
import { ZeebraTextComponent } from '../../../../reusables/zeebra-text/zeebra-text.component';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { ITeamDetailsPageResolverData } from './team-details-page.resolver';
import Match from '../../../../models/Match';
import MatchStatus from '../../../../values/MatchStatus';
import { MatchElementComponent } from '../../../../reusables/model-elements/match-element/match-element.component';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { TeamPlayerElementComponent } from "../../../../reusables/model-elements/team-player-element/team-player-element.component";

@Component({
    selector: 'app-team-details-page',
    standalone: true,
    imports: [
    CommonModule,
    MixinStyledCardDirectivesModule,
    RouterModule,
    CoverImageComponent,
    PageDirectivesModule,
    DividerComponent,
    MatchElementComponent,
    ContentGridDirectivesModule,
    TeamPlayerElementComponent
],
    templateUrl: './team-details-page.component.html',
})
export class TeamDetailsPageComponent {
    team!: Team;
    teamPlayers!: TeamPlayer[];
    inProgressMatches!: Match[];
    recentMatches!: Match[];

    get activePlayers() {
        return this.teamPlayers.filter((teamPlayer) => teamPlayer.isActive());
    }

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: ITeamDetailsPageResolverData = this.activatedRoute.snapshot.data[RESOLVER_DATA_KEY];
        this.inProgressMatches = data.matches.filter((match) => match.status === MatchStatus.IN_PROGRESS);
        this.recentMatches = data.matches;

        const parentData: ITeamLayoutPageResolverData = this.activatedRoute.snapshot.parent!.data[RESOLVER_DATA_KEY];
        this.team = parentData.team;
        this.teamPlayers = parentData.teamPlayers;
    }
}
