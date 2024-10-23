// See https://cldr.unicode.org/translation/date-time/date-time-patterns#basic-time-formats
// See https://cldr.unicode.org/translation/date-time/date-time-patterns#basic-date-formats

export const timeFormatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
});
export const dayNameFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
});
export const mediumDateFormatter = new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
});
export const fullDateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
});
export const mediumDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const debounce = (callback: Function, wait: number): () => void => {
    let timeoutId: number | undefined = undefined;
    return (): void => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout((): void => {
            callback.apply(null);
        }, wait);
    };
}