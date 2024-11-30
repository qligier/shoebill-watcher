import {fetchIgBuildLogs, IgBuildLog} from "./api";
import {buildPagination, domNodeDataRefresh, domNodeInputFilter, rebuildLogsInDom} from "./dom";
import {notifyError} from "./notification";
import {initRequestForm} from "./request-form";
import {Pagination} from "./pagination";
import {debounce} from "./utils";

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

const filterLogs: () => void = () => {
    if (allIgBuildLogs.length === 0) {
        pagination.logs = [];
        return;
    }
    const filter = domNodeInputFilter.value.toLowerCase();
    pagination.logs = allIgBuildLogs.filter((log: IgBuildLog) => {
        return log.name.toLowerCase().includes(filter)
            || log.title.toLowerCase().includes(filter)
            || log.packageId.toLowerCase().includes(filter)
            || log.repositoryOwner.toLowerCase().includes(filter)
            || log.repositoryName.toLowerCase().includes(filter)
            || log.repositoryBranch.toLowerCase().includes(filter);
    });
}

const refreshLogs: () => Promise<void> = async () => {
    if (fetchingData) {
        return;
    }
    setFetchingData(true);

    try {
        allIgBuildLogs = await fetchIgBuildLogs();
        // Sort and filter if necessary
        filterLogs();
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
domNodeInputFilter.addEventListener('input', () => debounce(filterLogs, 600)());
