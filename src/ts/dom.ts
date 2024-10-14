import {IgBuildLog} from "./api";
import packageJson from '#package.json' assert { type: 'json' };

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

document.querySelector("#shoebill-watcher")!.textContent = packageJson.version;

domNodeLogWrapper.addEventListener('click', (event: MouseEvent) => {

})

export const rebuildLogsInDom = (logs: Array<IgBuildLog>) => {
    const fragment = document.createDocumentFragment();

    let currentDay: CurrentDay | null = null;
    for (const log of logs) {
        // Initialize the current day wrapper, if needed
        const logDay = log.date.toDateString();
        if (currentDay === null || !currentDay.equals(logDay)) {
            if (currentDay !== null) {
                fragment.appendChild(currentDay.fragment);
            }
            currentDay = new CurrentDay(logDay, domTemplateLogDay.cloneNode(true) as HTMLTemplateElement);
            currentDay.template.querySelector('.date')!.textContent = logDay;
            currentDay.template.querySelector('.day-name')!.textContent = String(log.date.getDay());

        }


        const template = domTemplateLog.cloneNode(true) as HTMLTemplateElement;

        template.querySelector('.package-id')!.textContent = log.packageId;
        template.querySelector('.name')!.textContent = log.name;
        template.querySelector('.title')!.textContent = log.title;

        fragment.appendChild(template);
    }
    if (currentDay) {
        fragment.appendChild(currentDay.fragment);
    }

    // Clear the list and append the new elements
    domNodeLogWrapper.innerHTML = '';
    domNodeLogWrapper.appendChild(fragment);
}

class CurrentDay {
    private logsWrapper: HTMLElement;

    constructor(private readonly day: string,
                public readonly template: HTMLTemplateElement) {
        this.logsWrapper = template.content.querySelector('.logs')! as HTMLElement;
    }

    equals(day: string): boolean {
        return this.day === day;
    }

    appendChild(child: HTMLElement): void {
        this.logsWrapper.appendChild(child);
    }

    get fragment(): DocumentFragment {
        return this.template.content;
    }
}
