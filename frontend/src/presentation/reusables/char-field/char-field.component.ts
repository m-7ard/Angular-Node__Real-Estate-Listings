import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

type CharFieldSize = 'mixin-char-input-sm' | 'mixin-char-input-base';
type CharFieldTheme = 'theme-input-generic-white';

interface CharFieldOptions {
    size: CharFieldSize;
    theme: CharFieldTheme;
}

@Component({
    selector: 'app-char-field',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './char-field.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: CharFieldComponent,
        },
    ],
})
export class CharFieldComponent implements ControlValueAccessor {
    // <--ControlValueAccessor

    onChange: (value: string) => void = null!;
    onTouched: () => void = null!;

    writeValue(obj: string): void {
        this.value = obj;
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // ControlValueAccessor-->

    onInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.value = value;
        this.onChange(value);
        this.onTouched();
    }

    @Input() value: string = '';
    @Input() options: CharFieldOptions = {
        size: 'mixin-char-input-base',
        theme: 'theme-input-generic-white',
    };
    @Input() type?: string = 'text';
    @Input() step?: string;
    @Input() autocomplete?: boolean = false;
    @Input() disabled?: boolean = false;
    @Input() placeholder?: string;
    @Input() readonly?: boolean;
    @Input() maxLength?: number;
}
