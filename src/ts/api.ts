const logFileUrl = 'https://build.fhir.org/ig/qas.json';

/**
 * The model this application will be using.
 */
export interface IgBuildLog {
    name: string;
    title: string;
    description: string;
    url: string;
    packageId: string;
    igVersion: string;
    date: Date;
    errorCount: number;
    warningCount: number;
    hintCount: number;
    fhirVersion: string;
    gitHubRepository: string;
}

/**
 * The response from the FHIR build server.
 */
interface ApiResponseItem {
    url: string;
    name: string;
    title: string;
    description: string;
    status: string;
    'package-id': string;
    'ig-ver': string;
    date: string;
    dateISO8601: string;
    errs: number;
    warnings: number;
    hints: number;
    'suppressed-hints': number;
    'suppressed-warnings': number;
    version: string;
    tool: string;
    maxMemory: number;
    repo: string;
}
/*
{
    "url": "https://interoperabilidad.minsal.cl/fhir/ig/nid/ImplementationGuide/hl7.fhir.cl.minsal.nid-mpi-hpd",
    "name": "Nid_Mpi_Hpd_Minsal",
    "title": "Núcleo de Interoperabilidad de Datos (NID) - MINSAL",
    "description": "Núcleo de Interoperabilidad de Datos del Ministerio de Salud de Chile",
    "status": "draft",
    "package-id": "hl7.fhir.cl.minsal.nid-mpi-hpd",
    "ig-ver": "0.4.0",
    "date": "Tue, 08 Oct, 2024 13:08:18 +0000",
    "dateISO8601": "2024-10-08T13:08:18+00:00",
    "errs": 0,
    "warnings": 3,
    "hints": 8,
    "suppressed-hints": 0,
    "suppressed-warnings": 0,
    "version": "4.0.1",
    "tool": "5.0.0 (3)",
    "maxMemory": 10091008952,
    "repo": "Minsal-CL/NID/branches/master/qa.json"
  }
 */

export async function fetchIgBuildLogs(): Promise<Array<IgBuildLog>> {
    const response: Response = await fetch(logFileUrl);
    const data: Array<ApiResponseItem> = await response.json();
    const logs = new Array<IgBuildLog>(data.length);
    for (const row of data) {
        logs.push({
            name: row['name'] ?? '',
            title: row['title'] ?? '',
            description: row['description'] ?? '',
            url: row['url'] ?? '',
            packageId: row['package-id'] ?? '',
            igVersion: row['ig-ver'] ?? '',
            date: new Date(row['dateISO8601'] ?? ''),
            errorCount: row['errs'] ?? 0,
            warningCount: row['warnings'] ?? 0,
            hintCount: row['hints'] ?? 0,
            fhirVersion: row['version'] ?? '',
            gitHubRepository: row['repo'] ?? '',
        });
    }

    // Sort by date descending
    logs.sort((a: IgBuildLog, b: IgBuildLog): number => b.date.getTime() - a.date.getTime());
    return logs;
}
