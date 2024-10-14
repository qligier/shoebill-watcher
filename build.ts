import {spawn} from 'child_process';
import fs = require('fs');

const spawnProcess = (command: string, args: readonly string[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, {stdio: 'inherit'});
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
const cssBuildPromise = spawnProcess('npm', ['run', 'build-css']);
const jsBuildPromise = spawnProcess('npm', ['run', 'build-js']);

Promise.all([cssBuildPromise, jsBuildPromise]).then(() => {});
