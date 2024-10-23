import {Country, repoOwnersToCountries} from "./countries";
import YAML from 'yaml';

const qasFileUrl = 'https://build.fhir.org/ig/qas.json';
const buildsFileUrl = 'https://build.fhir.org/ig/builds.json';
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
                public readonly repositoryBranch: string,
                public readonly success: boolean) {
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
        return this.success ? 'success' : 'error';
    }

    get baseBuildUrl(): string {
        return `https://build.fhir.org/ig/${this.repositoryOwner}/${this.repositoryName}/branches/${this.repositoryBranch}/`;
    }

    get failureLogsUrl(): string {
        return `${this.baseBuildUrl}failure/build.log`;
    }

    get qaUrl(): string {
        return `${this.baseBuildUrl}qa.html`;
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
    const [succeededBuilds, failedBuilds] = await Promise.all([fetchSucceededBuilds(), fetchFailedBuilds()]);
    succeededBuilds.push(...failedBuilds.filter(log => log !== undefined));

    // Sort by date descending
    succeededBuilds.sort((a: IgBuildLog, b: IgBuildLog): number => b.date.getTime() - a.date.getTime());
    return succeededBuilds;
}

async function fetchSucceededBuilds(): Promise<Array<IgBuildLog>> {
    const response: Response = await fetch(qasFileUrl);
    const data: Array<ApiResponseItem> = await response.json();

    const builds = new Array<IgBuildLog>(data.length);
    let i = 0;
    for (const row of data) {
        const repoParts = row['repo'].split('/');
        builds[i++] = new IgBuildLog(
            row['name'] ?? '',
            row['title'] ?? '',
            row['description'] ?? '',
            row['url'] ?? '',
            row['package-id'] ?? '',
            row['ig-ver'] ?? '',
            parseDate(row['date'] ?? ''),
            row['errs'] ?? 0,
            row['warnings'] ?? 0,
            row['hints'] ?? 0,
            row['version'] ?? '',
            repoParts[0]!,
            repoParts[1]!,
            repoParts[3]!,
            true
        );
    }
    return builds;
}

/**
 * Fetches all the failed builds. This is done in two steps:
 * 1. Fetch the list of all log files from the builds.json file. If it contains the word 'failure', it is a failed build.
 *    Otherwise, we already have its details in the qas.json file.
 * 2. Fetch the log file for each failed build, extract some information and return it.
 */
async function fetchFailedBuilds(): Promise<Array<IgBuildLog | undefined>> {
    const response: Response = await fetch(buildsFileUrl);
    const allIgs = await response.json() as string[];
    const failedIgs = allIgs
        .filter(ig => ig.includes('failure'))
        .map(ig => ig.replace('/build.log', '/sushi-config.yaml'));
    const promises = failedIgs.map(async (ig) => {
        const response = await fetch(`https://build.fhir.org/ig/${ig}`);
        if (!response.ok) {
            // Here, we can try to fetch 'publication-request.json', which contains almost the same information.
            // Otherwise, we need to fetch 'ig.ini' to find the main IG file, and then fetch it
            //   ('input/ch.fhir.ig.XXX.xml').
            return undefined;
        }
        const yamlFile = await response.text();
        const yaml: SushiConfig = YAML.parse(yamlFile, { uniqueKeys: false, strict: false, stringKeys: true });

        const [owner, repo, , branch, ] = ig.split('/');
        const lastModified = response.headers.get('last-modified')!;

        return new IgBuildLog(
            yaml['name'] ?? '',
            yaml['title'] ?? '',
            yaml['description'] ?? '',
            yaml['canonical'] ?? '',
            yaml['id'] ?? '',
            yaml['version'] ?? '',
            parseDate(lastModified),
            1, // 1 fatal error
            0,
            0,
            yaml['fhirVersion'] ?? '',
            owner!,
            repo!,
            branch!,
            false
        );
    });

    return Promise.all(promises);
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

const parseDate = (date: string): Date => {
    const timestamp = Date.parse(date);
    if (isNaN(timestamp)) {
        throw new Error(`Invalid date: ${date}`);
    }
    return new Date(timestamp);
}

interface SushiConfig {
    id: string;
    canonical: string;
    name: string;
    title: string;
    description: string;
    status: string;
    version: string;
    fhirVersion: string;
    copyrightYear: string;
    releaseLabel: string;
    license: string;
    jurisdiction: string;
}