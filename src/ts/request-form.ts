import {requestIgBuild} from "./api";
import {debounce} from "./utils";

const requestForm = document.getElementById('new-build-request') as HTMLElement;
const ownerInput = document.getElementById('owner') as HTMLInputElement;
const repoInput = document.getElementById('repo') as HTMLInputElement;
const branchInput = document.getElementById('branch') as HTMLInputElement;
const knownRepoList = document.getElementById('known-repos') as HTMLDataListElement;
const knownBranchList = document.getElementById('known-branches') as HTMLDataListElement;

export function initRequestForm() {
    document.getElementById('request-new-build')!.addEventListener('click', () => {
        requestForm.classList.toggle('active');
    });
    document.querySelector('#new-build-request .close')!.addEventListener('click', () => {
        requestForm.classList.remove('active');
    });

    ownerInput.addEventListener('input', debounce(async () => {
        knownRepoList.innerHTML = '';
        branchInput.value = '';
        repoInput.value = '';
        const repos = await fetchReposForOwner(ownerInput.value);
        knownRepoList.innerHTML = '';
        repos.forEach(repo => addOption(repo, knownRepoList));
    }, 500));

    repoInput.addEventListener('input', debounce(async () => {
        knownBranchList.innerHTML = '';
        branchInput.value = '';
        const branches = await fetchBranchesForRepo(ownerInput.value, repoInput.value);
        branches.forEach(branch => addOption(branch, knownBranchList));
    }, 500));

    document.querySelector('#new-build-request span')!.addEventListener('click', async () => {
        requestIgBuild(ownerInput.value, repoInput.value, branchInput.value).then(() => {
        });
        requestForm.classList.remove('active');
    });
}

function addOption(value: string, dataList: HTMLDataListElement) {
    const option = document.createElement('option');
    option.value = value;
    dataList.appendChild(option);
}

// https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user
async function fetchReposForOwner(owner: string): Promise<string[]> {
    const response = await fetch(`https://api.github.com/users/${owner}/repos`, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        }
    });
    const data = await response.json() as GithubMinimalRepository[];
    return data.map(repo => repo.name);
}

interface GithubMinimalRepository {
    name: string;
}

// https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#list-branches
async function fetchBranchesForRepo(owner: string, repo: string): Promise<string[]> {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches`, {
        headers: {
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        }
    });
    const data = await response.json() as GithubShortBranch[];
    return data.map(repo => repo.name);
}

interface GithubShortBranch {
    name: string;
}