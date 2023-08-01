import * as core from '@actions/core';
import * as exec from '@actions/exec';
import {getLatestVersion} from './get-latest-version';
import {installer} from './installer';

export interface actionResult {
  exitcode: number;
  output: string;
}

export async function runCommand(
  cmd: string,
  args: string[]
): Promise<actionResult> {
  try {
    let result: actionResult = {
      exitcode: 0,
      output: ''
    };

    const options = {
      listeners: {
        stdout: (data: Buffer) => {
          result.output += data.toString();
        }
      }
    };

    result.exitcode = await exec.exec(cmd, args, options);
    core.debug(`
      exit code: ${result.exitcode}
      stdout: ${result.output}
    `);
    return result;
  } catch (e) {
    return e;
  }
}

// most @actions toolkit packages have async methods
export async function run(): Promise<any> {
  try {
    let result: actionResult = {
      exitcode: 0,
      output: ''
    };

    let pkgVersion: string =  await getLatestVersion('rxdn', 'mdbook-sitemap-generator', 'github');

    await installer(pkgVersion);

    core.info(`mdbook-sitemap-generator version: ${pkgVersion}`);
    
    let args: string[] = [
	    `-o ${core.getInput('output')}`,
      `-d ${core.getInput('domain')}`
    ];

    result = await runCommand('mdbook-sitemap-generator', args);

    return result;
  } catch (e) {
    core.setFailed(`Action failed with error ${e}`);
    return e;
  }
}
