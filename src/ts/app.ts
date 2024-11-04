import {fetchIgBuildLogs, IgBuildLog} from "./api";
import {buildPagination, domNodeDataRefresh, rebuildLogsInDom} from "./dom";
import {notifyError} from "./notification";
import {initRequestForm} from "./request-form";
import {Pagination} from "./pagination";

let allIgBuildLogs: IgBuildLog[] = [];
let fetchingData: boolean = false;

const pagination = new Pagination(50, rebuildLogsInDom, buildPagination);

const setFetchingData = (value: boolean) => {
    fetchingData = value;
    if (value) {
        domNodeDataRefresh.classList.add('active');
    } else {
        domNodeDataRefresh.classList.remove('active');
    }
}

const refreshLogs: () => Promise<void> = async () => {
    if (fetchingData) {
        return;
    }
    setFetchingData(true);

    try {
        allIgBuildLogs = await fetchIgBuildLogs();
        // Sort and filter if necessary
        pagination.logs = allIgBuildLogs;
    } catch (e: unknown) {
        if (e instanceof Error) {
            notifyError('Failed to fetch logs', e);
        }
        console.error(e);
    } finally {
        setFetchingData(false);
    }
}

initRequestForm();

refreshLogs().then(() => {
});
document.getElementById('refresh-data')!.addEventListener('click', refreshLogs);
