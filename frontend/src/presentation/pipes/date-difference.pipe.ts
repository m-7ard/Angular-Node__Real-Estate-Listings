import { Pipe, PipeTransform } from '@angular/core';
import dateDiff from '../utils/dateDifference';

@Pipe({
    name: 'dateDifference',
    standalone: true,
})
export class DateDifferencePipe implements PipeTransform {
    transform(date1: Date, args: [Date, 'seconds' | 'minutes' | 'hours' | 'days']): unknown {
        const [date2, unit] = args;
        return dateDiff(date1, date2, unit);
    }
}
