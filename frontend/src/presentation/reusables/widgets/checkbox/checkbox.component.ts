import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

type CheckboxSize = 'mixin-checkbox-sm'
type CheckboxTheme = 'theme-checkbox-generic-white'

interface CheckboxOptions {
    size: CheckboxSize;
    theme: CheckboxTheme;
}

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './checkbox.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: CheckboxComponent,
        },
    ],
})
export class CheckboxComponent implements ControlValueAccessor {
    // <--ControlValueAccessor

    private onChange(value: boolean): void {};
    private onTouched(): void {};

    writeValue(obj: boolean): void {
        this.value = obj;
    }

    registerOnChange(fn: (value: boolean) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // ControlValueAccessor-->

    onChecked(event: Event): void {
        const value = (event.target as HTMLInputElement).checked;
        this.value = value;
        this.onChange(value);
        this.checkChange.emit(value);
        this.onTouched();
    }

    @Input() value: boolean = false;
    @Input() options: CheckboxOptions = {
        size: 'mixin-checkbox-sm',
        theme: 'theme-checkbox-generic-white',
    };
    @Input() disabled?: boolean = false;

    @Output() checkChange = new EventEmitter<boolean>();
}
