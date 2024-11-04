import {IgBuildLog, requestIgBuild} from "./api";
import packageJson from '#package.json' assert {type: 'json'};
import {
    dayNameFormatter,
    fullDateFormatter,
    mediumDateFormatter,
    mediumDateTimeFormatter,
    timeFormatter
} from "./utils";

const domNodeLogWrapper: HTMLElement | null = document.getElementById("log-wrapper");
const domTemplateLogDay: HTMLElement | null = document.getElementById("log-day-template");
const domTemplateLog: HTMLElement | null = document.getElementById("log-template");
export const domNodeDataRefresh: HTMLElement = document.getElementById("refresh-data")!;
export const domTemplateNotification: HTMLTemplateElement = document.getElementById("notification-template") as HTMLTemplateElement;
export const domNodeNotifications: HTMLElement = document.getElementById("notifications")!;

if (!domNodeLogWrapper) {
    throw new Error("Could not find the log wrapper element");
}
if (!domTemplateLogDay) {
    throw new Error("Could not find the log-day template element");
}
if (!domTemplateLog) {
    throw new Error("Could not find the log template element");
}

document.querySelector("#shoebill-version")!.textContent = packageJson.version;

const requestRebuild = (targetLog: HTMLElement): void => {
    const dataset = targetLog.dataset;
    if (!dataset["repoOwner"] || !dataset["repoName"] || !dataset["repoBranch"]) {
        throw new Error("Missing repository information");
    }
    requestIgBuild(dataset["repoOwner"], dataset["repoName"], dataset["repoBranch"]).then(() => {
    });
}

domNodeLogWrapper.addEventListener('click', (event: MouseEvent): void => {
    if (event.target instanceof SVGElement) {
        if (event.target.matches('.switchy')) {
            // Toggle the details
            event.target.closest('.log')!.classList.toggle('switchy-open');
        } else if (event.target.matches('.request-rebuild svg')) {
            requestRebuild(event.target.closest('.log')!);
        }
        return;
    }
    if (event.target instanceof HTMLElement) {
        if (event.target.matches('.request-rebuild')) {
            requestRebuild(event.target.closest('.log')!);
        }
    }
});

export const rebuildLogsInDom = (logs: IgBuildLog[]): void => {
    const fragment: DocumentFragment = document.createDocumentFragment();

    let currentDay: CurrentDay | null = null;
    for (const log of logs) {
        // Initialize the current day wrapper, if needed
        const logDay = mediumDateFormatter.format(log.date);
        if (currentDay === null || !currentDay.equals(logDay)) {
            if (currentDay !== null) {
                fragment.appendChild(currentDay.fragment);
            }
            currentDay = new CurrentDay(logDay, domTemplateLogDay.cloneNode(true) as HTMLTemplateElement);
            currentDay.fragment.querySelector('.date')!.textContent = logDay;
            currentDay.fragment.querySelector('.date')!.setAttribute('title', fullDateFormatter.format(log.date));
            currentDay.fragment.querySelector('.day-name')!.textContent = dayNameFormatter.format(log.date);
        }

        // Create the log DOM nodes
        const template = domTemplateLog.cloneNode(true) as HTMLTemplateElement;

        template.content.querySelector('.status')!.classList.add(log.buildStatus);

        template.content.querySelector('.time')!.textContent = timeFormatter.format(log.date);
        template.content.querySelector('.time')!.setAttribute('title', mediumDateTimeFormatter.format(log.date));
        template.content.querySelector('.name span')!.textContent = log.name;
        template.content.querySelector('.title span')!.textContent = log.title;
        template.content.querySelector('.url a')!.textContent = log.url;
        template.content.querySelector('.url a')!.setAttribute("href", log.url);
        template.content.querySelector('.package-id')!.textContent = log.packageId;
        template.content.querySelector('.repository')!.setAttribute("href", log.repositoryUrl);
        const linkSpans: NodeListOf<Element> = template.content.querySelectorAll('.repository span');
        linkSpans[0]!.textContent = log.repositoryOwner;
        linkSpans[1]!.textContent = log.repositoryName;
        template.content.querySelector('.branch')!.appendChild(document.createTextNode(log.repositoryBranch));
        template.content.querySelector('.branch')!.setAttribute('title', `Git branch: ${log.repositoryBranch}`);
        template.content.querySelector('.ig-version')!.appendChild(document.createTextNode(log.igVersion));
        template.content.querySelector('.fhir-version')!.appendChild(document.createTextNode(log.fhirVersion));
        template.content.querySelector('.error-count')!.appendChild(document.createTextNode(`${log.errorCount} errors`));
        template.content.querySelector('.warning-count')!.appendChild(document.createTextNode(`${log.warningCount} warnings`));

        if (log.buildStatus === 'error') {
            template.content.querySelector('.status')!.setAttribute('title', 'The build has failed');
            template.content.querySelector('.link-failure-logs')!.setAttribute('href', log.failureLogsUrl);
            template.content.querySelector('.link-preview')!.remove();
            template.content.querySelector('.link-qa')!.remove();
        } else {
            template.content.querySelector('.status')!.setAttribute('title', 'The build has succeeded');
            template.content.querySelector('.link-failure-logs')!.remove();
            template.content.querySelector('.link-preview')!.setAttribute('href', log.baseBuildUrl);
            template.content.querySelector('.link-qa')!.setAttribute('href', log.qaUrl);
        }

        if (log.country) {
            const img: HTMLImageElement = document.createElement('img');
            img.src = `images/flags/${log.country}.svg`;
            img.alt = `Country: ${log.country}`;
            img.title = img.alt;
            template.content.querySelector('.country')!.appendChild(img);
        }

        const dataset: DOMStringMap = (template.content.querySelector('.log') as HTMLElement).dataset;
        dataset['repoOwner'] = log.repositoryOwner;
        dataset['repoName'] = log.repositoryName;
        dataset['repoBranch'] = log.repositoryBranch;

        currentDay.appendChild(template.content);
    }
    if (currentDay) {
        fragment.appendChild(currentDay.fragment);
    }

    // Clear the list and append the new elements
    domNodeLogWrapper.innerHTML = '';
    domNodeLogWrapper.appendChild(fragment);
}

class CurrentDay {
    private readonly logsWrapper: HTMLElement;

    constructor(private readonly day: string,
                public readonly template: HTMLTemplateElement) {
        this.logsWrapper = template.content.querySelector('.logs')!;
    }

    get fragment(): DocumentFragment {
        return this.template.content;
    }

    equals(day: string): boolean {
        return this.day === day;
    }

    appendChild(fragment: DocumentFragment): void {
        this.logsWrapper.appendChild(fragment);
    }
}
