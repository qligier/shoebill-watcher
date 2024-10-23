// The list of supported countries. The string value is the name of the flag icon.
export enum Country {
    Australia = 'au',
    Austria = 'at',
    Belgium = 'be',
    Chile = 'cl',
    Czechia = 'cz',
    Denmark = 'dk',
    Estonia = 'ee',
    Finland = 'fi',
    France = 'fr',
    Italy = 'it',
    Netherlands = 'nl',
    NewZealand = 'nz',
    Portugal = 'pt',
    SriLanka = 'lk',
    Sweden = 'se',
    Switzerland = 'ch',
    Vietnam = 'vn',
}

// The association map between repository owners and their respective countries.
export const repoOwnersToCountries: { [key: string]: Country } = {
    'hl7au': Country.Australia,
    'HealthIntersections': Country.Australia,
    'AuDigitalHealth': Country.Australia,
    'aehrc': Country.Australia,

    'HL7Austria': Country.Austria,

    'hl7-be': Country.Belgium,

    'Minsal-CL': Country.Chile,
    'HL7Chile': Country.Chile,

    'HL7-cz': Country.Czechia,

    'medcomdk': Country.Denmark,
    'fut-infrastructure': Country.Denmark,
    'hl7dk': Country.Denmark,

    'TEHIK-EE': Country.Estonia,

    'fhir-fi': Country.Finland,

    'ansforge': Country.France,
    'Interop-Sante': Country.France,

    'hl7-it': Country.Italy,

    'RIVO-Noord': Country.Netherlands,
    'SanteonNL': Country.Netherlands,

    'HL7NZ': Country.NewZealand,
    'tewhatuora': Country.NewZealand,

    'hl7-pt': Country.Portugal,

    'lk-gov-health-hiu': Country.SriLanka,

    'HL7Sweden': Country.Sweden,

    'hl7ch': Country.Switzerland,
    'ehealthsuisse': Country.Switzerland,

    'hl7vn': Country.Vietnam,
}
