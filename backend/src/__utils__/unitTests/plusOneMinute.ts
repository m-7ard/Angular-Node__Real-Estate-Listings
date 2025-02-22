import { DateTime } from "luxon";

export default function plusOneMinute(date: Date) {
    return DateTime.fromJSDate(date).plus({ minutes: 1 }).toJSDate();
}