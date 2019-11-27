import * as core from '@actions/core';
import * as exec from '@actions/exec';
import getLatestVersion from './get-latest-version';
import installer from './installer';

// most @actions toolkit packages have async methods
async function run() {
  const dump = async () => {
    // Show version
    await exec.exec('mdbook --version');
  };

  try {
    const mdbookVersion: string = core.getInput('mdbook-version');

    if (mdbookVersion === '' || mdbookVersion === 'latest') {
      getLatestVersion().then(
        async function(latestVersion): Promise<void> {
          console.log(`mdbook version: ${latestVersion} (${mdbookVersion})`);
          await installer(latestVersion);
          await dump();
        },
        function(error) {
          core.setFailed(error);
        }
      );
    } else {
      console.log(`mdbook version: ${mdbookVersion}`);
      await installer(mdbookVersion);
      await dump();
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();