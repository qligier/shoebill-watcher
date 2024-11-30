import {spawn} from 'child_process';
import fs from 'fs';

const spawnProcess = (command, args) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {stdio: 'inherit', shell: true});
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
  fs.rmSync('./dist', {recursive: true, force: true});
}
fs.mkdirSync('./dist');

// 2. Run the build steps
const isWindows = /^win/.test(process.platform);
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
const cssBuildPromise = spawnProcess(npmCommand, ['run', 'build-css']);
const jsBuildPromise = spawnProcess(npmCommand, ['run', 'build-js']);
const jsCopyStaticPromise = spawnProcess(npmCommand, ['run', isWindows ? 'build-static:windows' : 'build-static']);
const optimizeSvgPromise = spawnProcess(npmCommand, ['run', 'optimize-svg']);

Promise.all([cssBuildPromise, jsBuildPromise, jsCopyStaticPromise, optimizeSvgPromise]).then(() => {
});
