function dateDiff(a: Date, b: Date, unit: "seconds" | "minutes" | "hours" | "days" = "days"): number {
    const MS_PER_UNIT = {
        seconds: 1000,
        minutes: 1000 * 60,
        hours: 1000 * 60 * 60,
        days: 1000 * 60 * 60 * 24,
    };

    if (!MS_PER_UNIT[unit]) {
        throw new Error(`Invalid unit: ${unit}. Valid units are 'seconds', 'minutes', 'hours', 'days'.`);
    }

    const utcA = unit === "days" ? Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()) : a.getTime();
    const utcB = unit === "days" ? Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) : b.getTime();

    const difference = Math.floor(Math.abs(utcB - utcA) / MS_PER_UNIT[unit]);
    return difference;
}

export default dateDiff;
