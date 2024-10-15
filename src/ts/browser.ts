export const timeFormatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: 'short',
});

export const dayNameFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
});

export const mediumDateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
});