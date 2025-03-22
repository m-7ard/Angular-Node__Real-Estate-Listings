import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'generateLabelPipe',
    standalone: true,
})
export class GenerateLabelPipe implements PipeTransform {
    transform(input: string): string {
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
