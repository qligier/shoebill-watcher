import {domNodeNotifications, domTemplateNotification} from "./dom";

export function notifyError(title: string, error: Error): void {
    console.log(title);
    console.error(error);
    buildNotification(title, error.message, 'error');
}

function buildNotification(title: string, message: string | undefined, type: string): void {
    const template = domTemplateNotification.cloneNode(true) as HTMLTemplateElement;
    template.content.querySelector('.title')!.textContent += title;
    if (message) {
        template.content.querySelector('.message')!.textContent = message;
    } else {
        template.content.querySelector('.message')!.remove();
    }
    template.content.querySelector('.notification')!.classList.add(type);
    template.content.querySelectorAll(`h4 svg:not(.${type})`).forEach(svg => svg.remove());

    const delayedClose = window.setTimeout(() => {
        template.content.querySelector('.notification')?.remove();
    }, 10000);

    (template.content.querySelector('svg.close') as HTMLElement).addEventListener('click', (event: MouseEvent) => {
        if (event.target instanceof HTMLElement) {
            event.target?.closest('.notification')?.remove();
        }
        if (delayedClose) {
            window.clearTimeout(delayedClose);
        }
    });

    domNodeNotifications.appendChild(template.content);
}