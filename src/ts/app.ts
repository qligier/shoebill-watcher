import {fetchIgBuildLogs, IgBuildLog} from "./api";
import {rebuildLogsInDom} from "./dom";
import {notifyError} from "./notification";

let allIgBuildLogs: Array<IgBuildLog> = [];
let fetchingData: boolean = false;

const setFetchingData = (value: boolean) => {
    fetchingData = value;
    // TODO: update DOM to show/hide loading spinner
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
            notifyError('Failed to fetch logs', e).then(() => {});
        }
        console.error(e);
    }
}

refreshLogs().then(() => {});