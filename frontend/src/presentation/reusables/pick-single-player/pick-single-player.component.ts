import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    Component,
    ContentChild,
    EventEmitter,
    forwardRef,
    inject,
    Input,
    OnInit,
    TemplateRef,
    Type,
    ViewChild,
    viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Player from '../../models/Player';
import { CoverImageComponent } from '../cover-image/cover-image.component';
import {
    SearchPlayersModalComponentComponent,
    SearchPlayersModalComponentData,
} from '../search-players-modal-component/search-players-modal-component.component';
import { MixinStyledButtonDirective } from '../styled-button/styled-button.directive';
import { ZeebraTextComponent } from '../zeebra-text/zeebra-text.component';
import { MixinStyledCardDirectivesModule } from '../styled-card/styled-card.module';
import { PlayerSelectResultComponent } from '../search-players-modal-component/results/player-selector-result-component';

type DataType = SearchPlayersModalComponentData<typeof PlayerSelectResultComponent.prototype>;

@Component({
    selector: 'app-pick-single-player',
    standalone: true,
    imports: [
        CommonModule,
        CoverImageComponent,
        MixinStyledButtonDirective,
        MixinStyledCardDirectivesModule,
        ZeebraTextComponent,
    ],
    templateUrl: './pick-single-player.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PickSinglePlayerComponent),
            multi: true,
        },
    ],
})
export class PickSinglePlayerComponent implements ControlValueAccessor {
    private dialogRef!: DialogRef<unknown, SearchPlayersModalComponentComponent<Record<string, unknown>>>;
    private dialog = inject(Dialog);
    private results: Player[] = [];

    @Input() value: Player | null = null;

    propsFactoryFactory() {
        return (player: Player) => {
            return {
                isSelected: this.value?.id === player.id,
                player: player,
                selectPlayer: () => {
                    this.whenPlayerIsPicked(player);
                    this.dialogRef.componentInstance!.propsFactory = this.propsFactoryFactory();
                },
            };
        };
    }

    openPlayerPickerModal(): void {
        const data: DataType = {
            ResultComponent: PlayerSelectResultComponent,
            propsFactory: this.propsFactoryFactory()
        };

        this.dialogRef = this.dialog.open(SearchPlayersModalComponentComponent, {
            data: data,
        });
    }

    whenPlayerIsPicked(player: Player): void {
        this.value = player;
        this.onChange(player);
        this.onTouched();
    }

    resultProps(): Array<typeof PlayerSelectResultComponent.prototype> {
        return this.results.map((player) => ({
            isSelected: player.id === this.value?.id,
            player: player,
            selectPlayer: () => this.whenPlayerIsPicked(player),
        }));
    }

    // ControlValueAccessor methods
    writeValue(value: Player): void {
        this.value = value;
    }

    registerOnChange(fn: (value: Player) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    private onChange: (value: Player) => void = () => {
        throw new Error('Not implemented.');
    };
    private onTouched: () => void = () => {
        throw new Error('Not implemented.');
    };
}
