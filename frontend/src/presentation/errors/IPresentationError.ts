type IPresentationError<T> = {
    _?: string[];
} & {
    [K in keyof T]?: T[K] extends string[]
        ? string[]
        : T[K] extends object
            ? IPresentationError<T[K]>
            : string[];
};

export default IPresentationError;