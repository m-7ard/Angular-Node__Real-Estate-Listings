import { Component, EventEmitter, Inject, Type } from '@angular/core';
import Player from '../../models/Player';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { CharFieldComponent } from '../char-field/char-field.component';
import { PlayerDataAccessService } from '../../services/data-access/player-data-access.service';
import PlayerMapper from '../../mappers/PlayerMapper';
import { MixinStyledButtonDirective } from '../styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../styled-card/styled-card.module';
import { PanelDirectivesModule } from '../panel/panel.directive.module';
import { DividerComponent } from '../divider/divider.component';

interface IFormControls {
    name: FormControl<string>;
}

export interface SearchPlayersModalComponentData<P extends any> {
    ResultComponent: Type<P>;
    propsFactory: (player: Player) => P;
}

const routes = {
    form: 'form',
    results: 'results',
};

@Component({
    selector: 'app-search-players-modal-component',
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
    templateUrl: './search-players-modal-component.component.html',
})
export class SearchPlayersModalComponentComponent<P extends Record<string, unknown>> implements SearchPlayersModalComponentData<P>  {
    readonly ResultComponent: Type<P>;
    propsFactory: (player: Player) => P;

    currentRoute: keyof typeof routes = 'form';
    changeRoute(newRoute: keyof typeof routes) {
        this.currentRoute = newRoute;
    }

    form: FormGroup<IFormControls>;
    results: Player[] = [];


    constructor(
        public dialogRef: DialogRef<Player>,
        @Inject(DIALOG_DATA) data: SearchPlayersModalComponentData<P>,
        private playerDataAccess: PlayerDataAccessService,
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
        const responseObservable = this.playerDataAccess.listPlayers({
            name: rawValue.name,
            limitBy: null,
        });

        responseObservable.subscribe((dto) => {
            this.results = dto.players.map(PlayerMapper.apiModelToDomain);
            this.changeRoute('results');
        });
    }
}
