import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IFrontpageResolverData } from './frontpage.resolver';
import Player from '../../models/Player';
import Team from '../../models/Team';
import { RESOLVER_DATA_KEY } from '../../utils/RESOLVER_DATA';
import { DividerComponent } from '../../reusables/divider/divider.component';
import { PageDirectivesModule } from '../../reusables/page/page.directive.module';
import { MixinStyledCardDirectivesModule } from '../../reusables/styled-card/styled-card.module';
import Match from '../../models/Match';
import { ContentGridDirectivesModule } from '../../reusables/content-grid/content-grid.directive.module';
import { MatchElementComponent } from '../../reusables/model-elements/match-element/match-element.component';
import { PlayerElementComponent } from '../../reusables/model-elements/player-element/player-element.component';
import { TeamElementComponent } from '../../reusables/model-elements/team-element/team-element.component';

@Component({
    selector: 'app-frontpage',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MixinStyledCardDirectivesModule,
        PageDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
        MatchElementComponent,
        PlayerElementComponent,
        TeamElementComponent,
    ],
    templateUrl: './frontpage.component.html',
})
export class FrontpageComponent implements OnInit {
    public players: Player[] = null!;
    public teams: Team[] = null!;
    public matches: Match[] = null!;

    constructor(private activatedRoute: ActivatedRoute) {}

    public matchesDate = new Date();

    ngOnInit() {
        this.activatedRoute.data.subscribe((resolverData) => {
            const data = resolverData[RESOLVER_DATA_KEY] as IFrontpageResolverData;
            this.players = data.players;
            this.teams = data.teams;
            this.matches = data.matches;
        });
    }
}
