// The list of supported flags. The string value is the name of the flag icon.
export enum FlagIcon {
    // Countries first
    Australia = 'au',
    Austria = 'at',
    Belgium = 'be',
    Canada = 'ca',
    Chile = 'cl',
    CostaRica = 'cr',
    Czechia = 'cz',
    Denmark = 'dk',
    Estonia = 'ee',
    Ethiopia = 'et',
    Finland = 'fi',
    France = 'fr',
    Germany = 'de',
    Italy = 'it',
    Lithuania = 'lt',
    Netherlands = 'nl',
    NewZealand = 'nz',
    Nigeria = 'ng',
    Philippines = 'ph',
    Poland = 'pl',
    Portugal = 'pt',
    Russia = 'ru',
    SriLanka = 'lk',
    Sweden = 'se',
    Switzerland = 'ch',
    Taiwan = 'tw',
    UnitedKingdom = 'gb',
    Uzbekistan = 'uz',
    Vietnam = 'vn',
    Zimbabwe = 'zw',

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

    'HL7-cr': FlagIcon.CostaRica,

    'HL7-cz': FlagIcon.Czechia,

    'medcomdk': FlagIcon.Denmark,
    'fut-infrastructure': FlagIcon.Denmark,
    'hl7dk': FlagIcon.Denmark,

    'TEHIK-EE': FlagIcon.Estonia,

    'MoH-Ethiopia': FlagIcon.Ethiopia,

    'hl7-eu': FlagIcon.Europe,
    'Xt-EHR': FlagIcon.Europe,
    'EUVABECO': FlagIcon.Europe,
    'euridice-org': FlagIcon.Europe,

    'fhir-fi': FlagIcon.Finland,

    'ansforge': FlagIcon.France,
    'Interop-Sante': FlagIcon.France,

    'IHE-Germany': FlagIcon.Germany,
    'medizininformatik-initiative': FlagIcon.Germany,
    'hl7germany': FlagIcon.Germany,

    'HL7': FlagIcon.Hl7,
    'FHIR': FlagIcon.Hl7,

    'hl7-it': FlagIcon.Italy,

    'HL7LT': FlagIcon.Lithuania,

    'RIVO-Noord': FlagIcon.Netherlands,
    'SanteonNL': FlagIcon.Netherlands,
    'IKNL': FlagIcon.Netherlands,

    'HL7NZ': FlagIcon.NewZealand,
    'tewhatuora': FlagIcon.NewZealand,

    'Nigeria-FHIR-Community': FlagIcon.Nigeria,

    'UP-Manila-SILab': FlagIcon.Philippines,
    'UPM-NTHC': FlagIcon.Philippines,

    'HL7-Poland': FlagIcon.Poland,

    'hl7-pt': FlagIcon.Portugal,

    'fhir-ru': FlagIcon.Russia,

    'lk-gov-health-hiu': FlagIcon.SriLanka,

    'HL7Sweden': FlagIcon.Sweden,
    'commonprofiles-care': FlagIcon.Sweden,

    'hl7ch': FlagIcon.Switzerland,
    'ehealthsuisse': FlagIcon.Switzerland,
    'CARA-ch': FlagIcon.Switzerland,
    'bag-epl': FlagIcon.Switzerland,

    'TWNHIFHIR': FlagIcon.Taiwan,
    'MOHW-TWCoreIG': FlagIcon.Taiwan,

    'HL7-UK': FlagIcon.UnitedKingdom,
    'Interop-NWEngland': FlagIcon.UnitedKingdom,
    'nw-gmsa': FlagIcon.UnitedKingdom,

    'uzinfocom-org': FlagIcon.Uzbekistan,

    'PanAmericanHealthOrganization': FlagIcon.UnitedNations,
    'WorldHealthOrganization': FlagIcon.UnitedNations,
    'Uppsala-Monitoring-Centre': FlagIcon.UnitedNations,

    'hl7vn': FlagIcon.Vietnam,

    'mohcc': FlagIcon.Zimbabwe,
}
