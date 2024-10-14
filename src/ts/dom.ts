import {IgBuildLog} from "./api";

const domNodeLogWrapper: HTMLElement | null = document.getElementById("log-wrapper");
const domNodeLogTemplate: HTMLElement | null = document.getElementById("log-template");
if (!domNodeLogWrapper) {
    throw new Error("Could not find the log wrapper element");
}
if (!domNodeLogTemplate) {
    throw new Error("Could not find the log template element");
}

export const rebuildLogsInDom = (logs: Array<IgBuildLog>) => {
    const fragment = document.createDocumentFragment();

    for (const log of logs) {
        const template = domNodeLogTemplate.cloneNode(true) as HTMLElement;

        template.querySelector('.package-id')!.textContent = log.packageId;
        template.querySelector('.name')!.textContent = log.name;
        template.querySelector('.title')!.textContent = log.title;

        fragment.appendChild(template);
    }

    // Clear the list and append the new elements
    domNodeLogWrapper.innerHTML = '';
    domNodeLogWrapper.appendChild(fragment);
}