import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-form-field',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './form-field.component.html',
})
export class FormFieldComponent implements OnInit {
    @Input() errors?: string[];
    @Input() name!: string;
    @Input() label?: string;
    @Input() row?: boolean = false;
    @Input() helperTexts?: string[] = [];
    @ContentChild(TemplateRef) template = null!;
    context: { name: string } = null!;

    ngOnInit(): void {
        // console.log("name: ", this.name)
        this.context = { name: this.name };
    }

    generateLabel(input: string): string {
        if (/^[a-z]+(_[a-z]+)*$/.test(input)) {
            // Snake case detected: e.g., "snake_case_example"
            const words = input.split('_');
            const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            return capitalizedWords.join(' ');
        } else if (/^[a-z]+([A-Z][a-z]*)*$/.test(input)) {
            // Camel case detected: e.g., "camelCaseExample"
            const words = input.replace(/([A-Z])/g, ' $1');
            const capitalizedWords = words
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            return capitalizedWords.join(' ');
        } else {
            // Neither camelCase nor snake_case
            return input;
        }
    }
}
