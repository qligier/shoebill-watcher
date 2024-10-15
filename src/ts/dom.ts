import {IgBuildLog} from "./api";
import packageJson from '#package.json' assert {type: 'json'};
import {dayNameFormatter, mediumDateFormatter, timeFormatter} from "./browser";

const domNodeLogWrapper: HTMLElement | null = document.getElementById("log-wrapper");
const domTemplateLogDay: HTMLElement | null = document.getElementById("log-day-template");
const domTemplateLog: HTMLElement | null = document.getElementById("log-template");
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

domNodeLogWrapper.addEventListener('click', (event: MouseEvent) => {
    if (!(event.target instanceof HTMLElement)) {
        return;
    }
    if (event.target.matches('.open-details')) {
        // Toggle the details
        // https://frontendmasters.com/blog/patterns-for-memory-efficient-dom-manipulation/#use-event-delegation-to-bind-fewer-events
    }
})

export const rebuildLogsInDom = (logs: Array<IgBuildLog>) => {
    const fragment = document.createDocumentFragment();

    let currentDay: CurrentDay | null = null;
    for (const log of logs) {
        // Initialize the current day wrapper, if needed
        const logDay = mediumDateFormatter.format(log.date);
        if (!currentDay?.equals(logDay)) {
            if (currentDay !== null) {
                fragment.appendChild(currentDay.fragment);
            }
            currentDay = new CurrentDay(logDay, domTemplateLogDay.cloneNode(true) as HTMLTemplateElement);
            currentDay.fragment.querySelector('.date')!.textContent = logDay;
            currentDay.fragment.querySelector('.day-name')!.textContent = dayNameFormatter.format(log.date);
        }

        // Create the log DOM nodes
        const template = domTemplateLog.cloneNode(true) as HTMLTemplateElement;

        template.content.querySelector('.status')!.classList.add(log.buildStatus);
        template.content.querySelector('.status')!.setAttribute('title', log.buildStatus === 'error' ? 'Error' : 'Success');
        template.content.querySelector('.time')!.textContent = timeFormatter.format(log.date);
        template.content.querySelector('.name')!.textContent = log.name;
        template.content.querySelector('.title')!.textContent = log.title;
        template.content.querySelector('.package-id')!.textContent = log.packageId;
        template.content.querySelector('.repository')!.setAttribute("href", log.repositoryUrl);
        const linkSpans = template.content.querySelectorAll('.repository span');
        linkSpans[0]!.textContent = log.repositoryOwner;
        linkSpans[1]!.textContent = log.repositoryName;
        template.content.querySelector('.branch')!.textContent = log.repositoryBranch;
        template.content.querySelector('.branch')!.setAttribute('title', log.repositoryBranch);
        template.content.querySelector('.fhir-version')!.textContent = log.fhirVersion;

        if (log.country) {
            const img = document.createElement('img');
            img.src = `images/flags/${log.country}.svg`;
            img.alt = `Country: log.country`;
            template.content.querySelector('.country')!.appendChild(img);
        }

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
