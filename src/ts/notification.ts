import {domNodeNotifications, domTemplateNotification} from "./dom";

export function notifyError(title: string, error: Error | string): void {
    if (typeof error === 'string') {
        buildNotification(title, error, 'error');
    } else {
        buildNotification(title, error.message, 'error');
    }
}

export function notifyWarning(title: string, message: string): void {
    buildNotification(title, message, 'warning');
}

export function notifyInfo(title: string, message: string): void {
    buildNotification(title, message, 'info');
}

export function notifySuccess(title: string, message: string): void {
    buildNotification(title, message, 'success');
}

type NotificationType = 'error' | 'warning' | 'info' | 'success';

function buildNotification(title: string, message: string | undefined, type: NotificationType): void {
    const template = domTemplateNotification.cloneNode(true) as HTMLTemplateElement;
    template.content.querySelector('h4')!.appendChild(document.createTextNode(title));
    if (message) {
        template.content.querySelector('p')!.textContent = message;
    } else {
        template.content.querySelector('p')!.remove();
    }
    template.content.querySelector('.notification')!.classList.add(type);
    template.content.querySelectorAll(`h4 svg:not(.${type})`).forEach(svg => svg.remove());

    // Insert the notification into the DOM
    const notificationNode = template.content.querySelector('.notification') as HTMLElement;
    domNodeNotifications.appendChild(notificationNode);

    // Create a timer to automatically close the notification
    const delayedClose: number | undefined = window.setTimeout(() => {
        notificationNode.remove();
    }, 10_000);

    // Bind the close button to remove the notification
    notificationNode.querySelector('svg.close')!.addEventListener('click', () => {
        notificationNode.remove();
        window.clearTimeout(delayedClose);
    });

}