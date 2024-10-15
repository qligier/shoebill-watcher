import {Country, repoOwnersToCountries} from "./countries";

const logFileUrl = 'https://build.fhir.org/ig/qas.json';
const igBuildRequestUrl = 'https://us-central1-fhir-org-starter-project.cloudfunctions.net/ig-commit-trigger';

/**
 * The model this application will be using.
 */
export class IgBuildLog {
    constructor(public readonly name: string,
                public readonly title: string,
                public readonly description: string,
                public readonly url: string,
                public readonly packageId: string,
                public readonly igVersion: string,
                public readonly date: Date,
                public readonly errorCount: number,
                public readonly warningCount: number,
                public readonly hintCount: number,
                public readonly fhirVersion: string,
                public readonly repositoryOwner: string,
                public readonly repositoryName: string,
                public readonly repositoryBranch: string) {
    }

    get repositoryUrl(): string {
        return `https://github.com/${this.repositoryOwner}/${this.repositoryName}/tree/${this.repositoryBranch}`;
    }

    get country(): Country | undefined {
        if (this.repositoryOwner in repoOwnersToCountries) {
            return repoOwnersToCountries[this.repositoryOwner];
        }
        return undefined;
    }

    get buildStatus(): string {
        return this.errorCount > 0 ? 'error' : 'success';
    }
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

export async function fetchIgBuildLogs(): Promise<Array<IgBuildLog>> {
    const response: Response = await fetch(logFileUrl);
    const data: Array<ApiResponseItem> = await response.json();

    const logs = new Array<IgBuildLog>(data.length);
    let i = 0;
    for (const row of data) {
        const repoParts = row['repo'].split('/');
        logs[i++] = new IgBuildLog(
            row['name'] ?? '',
            row['title'] ?? '',
            row['description'] ?? '',
            row['url'] ?? '',
            row['package-id'] ?? '',
            row['ig-ver'] ?? '',
            parseDate(row['date'] ?? '', row),
            row['errs'] ?? 0,
            row['warnings'] ?? 0,
            row['hints'] ?? 0,
            row['version'] ?? '',
            repoParts[0]!,
            repoParts[1]!,
            repoParts[3]!,
        );
    }

    // Sort by date descending
    logs.sort((a: IgBuildLog, b: IgBuildLog): number => b.date.getTime() - a.date.getTime());
    return logs;
}

export async function requestIgBuild(repoOwner: string, repoName: string, branch: string): Promise<void> {
    await fetch(igBuildRequestUrl, {
        method: "POST",
        body: JSON.stringify({
            ref: `refs/heads/${branch}`,
            repository: {
                full_name: `${repoOwner}/${repoName}`
            }
        })
    });
}

const parseDate = (date: string, object: object): Date => {
    const timestamp = Date.parse(date);
    if (isNaN(timestamp)) {
        console.log(object);
        throw new Error(`Invalid date: ${date}`);
    }
    return new Date(timestamp);
}