import {fetchIgBuildLogs, IgBuildLog} from "./api";
import {rebuildLogsInDom} from "./dom";

let allIgBuildLogs: Array<IgBuildLog> = [];

const refreshLogs: () => Promise<void> = async () => {
    allIgBuildLogs = await fetchIgBuildLogs();
    // Sort and filter if necessary
    rebuildLogsInDom(allIgBuildLogs);
}

refreshLogs().then(() => {});