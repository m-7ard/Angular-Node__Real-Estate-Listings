import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeNgPopoverDirective } from '../prime-ng-popover/prime-ng-popover.directive';
import { MixinStyledButtonDirective } from '../styled-button/styled-button.directive';
import { Popover, PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';

type Option<T> = { label: string; value: T };

@Component({
    selector: 'app-select',
    standalone: true,
    imports: [PrimeNgPopoverDirective, MixinStyledButtonDirective, PopoverModule, CommonModule],
    templateUrl: './select.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true,
        },
    ],
})
export class SelectComponent<T> implements ControlValueAccessor, OnInit {
    @Input() set options(value: Array<Option<T>>) {
        this._options = value;
        this.labelMap = new Map(value.map((option) => [option.value, option.label]));
        if (this.value) {
            this.label = this.getLabelForValue(this.value);
        }
    }
    get options(): Array<Option<T>> {
        return this._options;
    }
    private _options!: Array<Option<T>>;

    @Input() value: T | null = null;

    public label: string = '---';
    private labelMap = new Map<T, string>();

    @ViewChild('op') op!: Popover;

    onSelect(option: Option<T>) {
        this.value = option.value;
        this.label = option.label;
        this.onChange(option.value);
        this.onTouched();
        this.op.hide();
    }

    private getLabelForValue(value: T): string {
        return this.labelMap.get(value) ?? '---';
    }

    ngOnInit(): void {
        if (this.value) {
            this.label = this.getLabelForValue(this.value);
        }
    }

    // ControlValueAccessor methods
    writeValue(value: T): void {
        this.value = value;
        this.label = this.getLabelForValue(value);
    }

    registerOnChange(fn: (value: T) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    private onChange(value: T) {}
    private onTouched: () => void = () => {};
}
