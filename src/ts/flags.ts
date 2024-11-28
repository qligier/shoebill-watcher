// The list of supported flags. The string value is the name of the flag icon.
export enum FlagIcon {
    // Countries first
    Australia = 'au',
    Austria = 'at',
    Belgium = 'be',
    Canada = 'ca',
    Chile = 'cl',
    Czechia = 'cz',
    Denmark = 'dk',
    Estonia = 'ee',
    Finland = 'fi',
    France = 'fr',
    Germany = 'de',
    Italy = 'it',
    Netherlands = 'nl',
    NewZealand = 'nz',
    Portugal = 'pt',
    SriLanka = 'lk',
    Sweden = 'se',
    Switzerland = 'ch',
    UnitedKingdom = 'gb',
    Vietnam = 'vn',

    // Then organizations
    Europe = 'eu',
    Hl7 = 'hl7',
    UnitedNations = 'un',
}

// The association map between repository owners and their respective flags.
export const repoOwnersToFlags: { [key: string]: FlagIcon } = {
    'hl7au': FlagIcon.Australia,
    'HealthIntersections': FlagIcon.Australia,
    'AuDigitalHealth': FlagIcon.Australia,
    'aehrc': FlagIcon.Australia,

    'HL7Austria': FlagIcon.Austria,

    'hl7-be': FlagIcon.Belgium,

    'HL7-Canada': FlagIcon.Canada,

    'Minsal-CL': FlagIcon.Chile,
    'HL7Chile': FlagIcon.Chile,
    'HL7Chile-BiomedicaUv': FlagIcon.Chile,
    'cens-chile': FlagIcon.Chile,

    'HL7-cz': FlagIcon.Czechia,

    'medcomdk': FlagIcon.Denmark,
    'fut-infrastructure': FlagIcon.Denmark,
    'hl7dk': FlagIcon.Denmark,

    'TEHIK-EE': FlagIcon.Estonia,

    'hl7-eu': FlagIcon.Europe,
    'Xt-EHR': FlagIcon.Europe,
    'EUVABECO': FlagIcon.Europe,

    'fhir-fi': FlagIcon.Finland,

    'ansforge': FlagIcon.France,
    'Interop-Sante': FlagIcon.France,

    'IHE-Germany': FlagIcon.Germany,
    'medizininformatik-initiative': FlagIcon.Germany,

    'HL7': FlagIcon.Hl7,
    'FHIR': FlagIcon.Hl7,

    'hl7-it': FlagIcon.Italy,

    'RIVO-Noord': FlagIcon.Netherlands,
    'SanteonNL': FlagIcon.Netherlands,

    'HL7NZ': FlagIcon.NewZealand,
    'tewhatuora': FlagIcon.NewZealand,

    'hl7-pt': FlagIcon.Portugal,

    'lk-gov-health-hiu': FlagIcon.SriLanka,

    'HL7Sweden': FlagIcon.Sweden,
    'commonprofiles-care': FlagIcon.Sweden,

    'hl7ch': FlagIcon.Switzerland,
    'ehealthsuisse': FlagIcon.Switzerland,
    'CARA-ch': FlagIcon.Switzerland,
    'bag-epl': FlagIcon.Switzerland,

    'HL7-UK': FlagIcon.UnitedKingdom,

    'PanAmericanHealthOrganization': FlagIcon.UnitedNations,
    'WorldHealthOrganization': FlagIcon.UnitedNations,

    'hl7vn': FlagIcon.Vietnam,
}
