import { CommonModule } from '@angular/common';
import { Component, Inject, Type } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CharFieldComponent } from '../char-field/char-field.component';
import { DividerComponent } from '../divider/divider.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { PanelDirectivesModule } from '../panel/panel.directive.module';
import { MixinStyledButtonDirective } from '../styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../styled-card/styled-card.module';
import { TeamDataAccessService } from '../../services/data-access/team-data-access.service';
import TeamMapper from '../../mappers/TeamMapper';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import Team from '../../models/Team';

interface IFormControls {
    name: FormControl<string>;
}

const routes = {
    form: 'form',
    results: 'results',
};

export interface SearchTeamsModalComponentData<P extends any> {
    ResultComponent: Type<P>;
    propsFactory: (team: Team) => P;
}

@Component({
    selector: 'app-search-teams-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormFieldComponent,
        CharFieldComponent,
        ReactiveFormsModule,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        PanelDirectivesModule,
        DividerComponent,
    ],
    templateUrl: './search-teams-modal.component.html',
})
export class SearchTeamsModalComponent<P extends Record<string, unknown>> implements SearchTeamsModalComponentData<P> {
    readonly ResultComponent: Type<P>;
    propsFactory: (team: Team) => P;

    currentRoute: keyof typeof routes = 'form';
    changeRoute(newRoute: keyof typeof routes) {
        this.currentRoute = newRoute;
    }

    form: FormGroup<IFormControls>;
    results: Team[] = [];

    constructor(
        public dialogRef: DialogRef<Team>,
        @Inject(DIALOG_DATA) data: SearchTeamsModalComponentData<P>,
        private teamDataAccess: TeamDataAccessService,
    ) {
        this.form = new FormGroup<IFormControls>({
            name: new FormControl('', {
                nonNullable: true,
                validators: [],
            }),
        });

        this.ResultComponent = data.ResultComponent;
        this.propsFactory = data.propsFactory;
    }

    close() {
        this.dialogRef.close();
    }

    async onFormSubmit() {
        const rawValue = this.form.getRawValue();
        const responseObservable = this.teamDataAccess.listTeams({
            name: rawValue.name,
            limitBy: null,
            teamMembershipPlayerId: null
        });

        responseObservable.subscribe((dto) => {
            this.results = dto.teams.map(TeamMapper.apiModelToDomain);
            this.changeRoute('results');
        });
    }
}
