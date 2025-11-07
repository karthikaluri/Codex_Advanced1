const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// This runner uses Docker to execute code in isolated containers.
// IMPORTANT: Docker must be running and the executing user must have permissions.
// The approach: create a temp directory with code and a small runner script, then run a suitable image.
// Note: For production-grade isolation use proper sandbox solutions with resource limits.

function writeTempFiles(tempDir, files){
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  for (const [name, content] of Object.entries(files)){
    fs.writeFileSync(path.join(tempDir, name), content);
  }
}

function runInDocker({ language, code, stdin, timeout = 5000 }){
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const tmp = path.join('/tmp', 'codex_run_' + id);
    const files = {};
    let image = 'node:18-alpine';
    let cmd = '';

    if (language === 'javascript'){
      files['usercode.js'] = code;
      // test runner will require usercode and run it
      files['runner.sh'] = '#!/bin/sh\nnode usercode.js';
      cmd = 'sh runner.sh';
      image = process.env.DOCKER_RUNNER_IMAGE || 'node:18-alpine';
    } else if (language === 'python'){
      files['usercode.py'] = code;
      files['runner.sh'] = '#!/bin/sh\npython usercode.py';
      cmd = 'sh runner.sh';
      image = 'python:3.11-alpine';
    } else {
      return reject(new Error('Unsupported language'));
    }

    writeTempFiles(tmp, files);

    // Build docker arguments
    // - mount tmp to /workspace inside container
    // - workdir /workspace
    // - remove container after run
    // - set a timeout at the process-level to avoid hanging
    const dockerArgs = [
      'run', '--rm',
      '-v', `${tmp}:/workspace`,
      '-w', '/workspace',
      image,
      'sh', '-c', cmd
    ];

    const child = execFile('docker', dockerArgs, { timeout: timeout }, (error, stdout, stderr) => {
      // cleanup temp dir
      try { fs.rmSync(tmp, { recursive: true, force: true }); } catch(e){}
      if (error) {
        return resolve({ success: false, error: String(error), stdout, stderr });
      }
      resolve({ success: true, stdout, stderr });
    });
  });
}

module.exports = { runInDocker };
