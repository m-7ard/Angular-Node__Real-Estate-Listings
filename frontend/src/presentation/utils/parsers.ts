import { DateTime } from 'luxon';

// type DateOrFallback<T> = Date & { __type: T };

const parsers = {
    parseJsDateToInputDate: (date: Date): string => {
        return DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
    },
    parseJsDateToInputDatetimeLocal: (date: Date): string => {
        return DateTime.fromJSDate(date).toFormat("yyyy-MM-dd'T'HH:mm:ss");
    },
};

export default parsers;
