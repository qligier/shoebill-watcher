// The list of supported countries. The string value is the name of the flag icon.
export enum Country {
    Switzerland = 'ch',
}

// The association map between repository owners and their respective countries.
export const repoOwnersToCountries: { [key: string]: Country } = {
    'hl7ch': Country.Switzerland,
    'ehealthsuisse': Country.Switzerland,
}
