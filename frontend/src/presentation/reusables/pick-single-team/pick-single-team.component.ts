import { DialogRef, Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, forwardRef, inject, Input, TemplateRef, ViewChild } from '@angular/core';
import Team from '../../models/Team';
import { TeamSelectResultComponent } from '../search-teams-modal/results/team-selector-result-component';
import {
    SearchTeamsModalComponent,
    SearchTeamsModalComponentData,
} from '../search-teams-modal/search-teams-modal.component';
import { CommonModule } from '@angular/common';
import { CoverImageComponent } from '../cover-image/cover-image.component';
import { MixinStyledButtonDirective } from '../styled-button/styled-button.directive';
import { MixinStyledCardDirectivesModule } from '../styled-card/styled-card.module';
import { ZeebraTextComponent } from '../zeebra-text/zeebra-text.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type DataType = SearchTeamsModalComponentData<typeof TeamSelectResultComponent.prototype>;

@Component({
    selector: 'app-pick-single-team',
    standalone: true,
    imports: [
        CommonModule,
        CoverImageComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        ZeebraTextComponent,
    ],
    templateUrl: './pick-single-team.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PickSingleTeamComponent),
            multi: true,
        },
    ],
})
export class PickSingleTeamComponent implements ControlValueAccessor {
    private dialogRef!: DialogRef<unknown, SearchTeamsModalComponent<Record<string, unknown>>>;
    private dialog = inject(Dialog);
    private results: Team[] = [];

    @Input() value: Team | null = null;

    propsFactoryFactory() {
        return (team: Team) => {
            return {
                isSelected: this.value?.id === team.id,
                team: team,
                selectTeam: () => {
                    this.whenTeamIsPicked(team);
                    this.dialogRef.componentInstance!.propsFactory = this.propsFactoryFactory();
                },
            };
        };
    }

    openTeamPickerModal(): void {
        const data: DataType = {
            ResultComponent: TeamSelectResultComponent,
            propsFactory: this.propsFactoryFactory()
        };

        this.dialogRef = this.dialog.open(SearchTeamsModalComponent, {
            data: data,
        });
    }

    whenTeamIsPicked(team: Team): void {
        this.value = team;
        this.onChange(team);
        this.onTouched();
    }

    resultProps(): Array<typeof TeamSelectResultComponent.prototype> {
        return this.results.map((team) => ({
            isSelected: team.id === this.value?.id,
            team: team,
            selectTeam: () => this.whenTeamIsPicked(team),
        }));
    }

    // ControlValueAccessor methods
    writeValue(value: Team): void {
        this.value = value;
    }

    registerOnChange(fn: (value: Team) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    private onChange: (value: Team) => void = () => {
        throw new Error('Not implemented.');
    };
    private onTouched: () => void = () => {
        throw new Error('Not implemented.');
    };
}
