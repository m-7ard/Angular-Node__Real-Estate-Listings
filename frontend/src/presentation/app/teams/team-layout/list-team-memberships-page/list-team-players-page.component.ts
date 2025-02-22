import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import TeamPlayer from '../../../../models/TeamPlayer';
import Team from '../../../../models/Team';
import { CommonModule } from '@angular/common';
import { ITeamLayoutPageResolverData } from '../team-layout-page.resolver';
import { MixinStyledButtonDirective } from '../../../../reusables/styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../../../../reusables/styled-card/styled-card.module';
import { PageDirectivesModule } from '../../../../reusables/page/page.directive.module';
import { DividerComponent } from '../../../../reusables/divider/divider.component';
import { ContentGridDirectivesModule } from '../../../../reusables/content-grid/content-grid.directive.module';
import { TeamPlayerElementComponent } from '../../../../reusables/model-elements/team-player-element/team-player-element.component';

@Component({
    selector: 'app-list-team-players-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MixinStyledCardDirectivesModule,
        PageDirectivesModule,
        ContentGridDirectivesModule,
        DividerComponent,
        TeamPlayerElementComponent
    ],
    templateUrl: './list-team-players-page.component.html',
})
export class ListTeamPlayersPageComponent {
    team!: Team;
    teamPlayers!: TeamPlayer[];

    activeTeamPlayers: TeamPlayer[] = [];
    inactiveTeamPlayers: TeamPlayer[] = [];
    
    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        const data: ITeamLayoutPageResolverData = this.activatedRoute.snapshot.parent!.data['RESOLVER_DATA'];
        this.team = data.team;
        this.teamPlayers = data.teamPlayers;

        this.teamPlayers.forEach((teamPlayer) => {
            if (teamPlayer.isActive()) {
                this.activeTeamPlayers.push(teamPlayer);
            } else {
                this.inactiveTeamPlayers.push(teamPlayer);
            }
        })
    }

    onDeleteTeamPlayer(teamPlayer: TeamPlayer) {
        this.teamPlayers = this.teamPlayers.filter((value) => value.membership.id !== teamPlayer.membership.id);
    }
}
