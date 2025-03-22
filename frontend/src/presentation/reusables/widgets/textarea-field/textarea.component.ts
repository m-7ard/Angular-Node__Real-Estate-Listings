import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

type TextareaSize = 'mixin-textarea-any';
type TextareaTheme = 'theme-textarea-generic-white';

interface TextareaOptions {
    size: TextareaSize;
    theme: TextareaTheme;
}

@Component({
    selector: 'app-textarea',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './textarea.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: TextareaComponent,
        },
    ],
})
export class TextareaComponent implements ControlValueAccessor {
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
        const value = (event.target as HTMLTextAreaElement).value;
        this.value = value;
        this.onChange(value);
        this.onTouched();
    }

    @Input() value: string = '';
    @Input() options: TextareaOptions = {
        size: 'mixin-textarea-any',
        theme: 'theme-textarea-generic-white',
    };
    @Input() disabled?: boolean = false;
    @Input() placeholder?: string = "";
    @Input() readonly?: boolean;
    @Input() maxLength?: number;
}
