import {spawn} from 'child_process';
import fs from 'fs';

const spawnProcess = (command, args) => {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { stdio: 'inherit', shell: true });
        process.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });
    });
}

// 1. Prepare the 'dist' directory
if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true, force: true });
}
fs.mkdirSync('./dist');

// 2. Run the build steps
const npmCommand = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
const cssBuildPromise = spawnProcess(npmCommand, ['run', 'build-css']);
const jsBuildPromise = spawnProcess(npmCommand, ['run', 'build-js']);
const jsCopyStatic = spawnProcess(npmCommand, ['run', 'build-static']);

Promise.all([cssBuildPromise, jsBuildPromise, jsCopyStatic]).then(() => {});
