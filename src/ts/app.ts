import {fetchIgBuildLogs, IgBuildLog} from "./api";
import {domNodeDataRefresh, rebuildLogsInDom} from "./dom";
import {notifyError} from "./notification";

let allIgBuildLogs: Array<IgBuildLog> = [];
let fetchingData: boolean = false;

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
        rebuildLogsInDom(allIgBuildLogs);
    } catch (e: unknown) {
        setFetchingData(false);
        if (e instanceof Error) {
            notifyError('Failed to fetch logs', e);
        }
        console.error(e);
    }
}

refreshLogs().then(() => {
});