import {IgBuildLog, requestIgBuild} from "./api";
import packageJson from '#package.json' assert {type: 'json'};
import {
    dayNameFormatter,
    fullDateFormatter,
    mediumDateFormatter,
    mediumDateTimeFormatter,
    timeFormatter
} from "./utils";
import {
    Pagination,
    PaginationCurrentPage,
    PaginationEllipsis,
    PaginationItem,
    PaginationNextPage,
    PaginationPage,
    PaginationPreviousPage
} from "./pagination";

const domNodeLogWrapper: HTMLElement = document.getElementById("log-wrapper")!;
const domTemplateLogDay: HTMLElement = document.getElementById("log-day-template")!;
const domTemplateLog: HTMLElement = document.getElementById("log-template")!;
export const domNodeDataRefresh: HTMLElement = document.getElementById("refresh-data")!;
export const domTemplateNotification: HTMLTemplateElement = document.getElementById("notification-template") as HTMLTemplateElement;
export const domNodeNotifications: HTMLElement = document.getElementById("notifications")!;
const domPaginationWrapper: HTMLElement = document.getElementById("pagination-wrapper")!;
export const domNodeInputFilter: HTMLInputElement = document.getElementById("search-input") as HTMLInputElement;

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

        const flag = log.flag;
        if (flag) {
            const img: HTMLImageElement = document.createElement('img');
            img.src = `images/flags/${flag}.svg`;
            img.alt = `Flag: ${flag}`;
            img.title = img.alt;
            template.content.querySelector('.flag')!.appendChild(img);
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

export const buildPagination = (items: PaginationItem[], pagination: Pagination): void => {
    domPaginationWrapper.innerHTML = '';

    for (const item of items) {
        const li: HTMLLIElement = document.createElement('li');
        if (item instanceof PaginationEllipsis) {
            li.classList.add('ellipsis');
            li.textContent = '…';
        } else if (item instanceof PaginationPage) {
            li.classList.add('page', 'clickable');
            li.textContent = item.page.toString();
            li.onclick = () => {
                pagination.page = item.page;
                window.scroll(0, 0);
            };
            li.setAttribute('title', `Go to page ${item.page}`);
        } else if (item instanceof PaginationCurrentPage) {
            li.classList.add('page', 'current');
            li.textContent = item.page.toString();
            li.setAttribute('title', 'Current page');
        } else if (item instanceof PaginationPreviousPage) {
            li.classList.add('page', 'previous', 'clickable');
            li.textContent = 'Previous';
            li.onclick = () => {
                pagination.page = item.page;
                window.scroll(0, 0);
            };
            li.setAttribute('title', `Go to page ${item.page}`);
        } else if (item instanceof PaginationNextPage) {
            li.classList.add('page', 'next', 'clickable');
            li.textContent = 'Next';
            li.onclick = () => {
                pagination.page = item.page;
                window.scroll(0, 0);
            };
            li.setAttribute('title', `Go to page ${item.page}`);
        }
        domPaginationWrapper.appendChild(li);
    }
};