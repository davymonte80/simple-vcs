import fs from 'fs';
import path from 'path';

/**
 * Clones a repository from the source directory to the destination directory.
 *
 * @param source - The path to the source repository.
 * @param destination - The path to the destination directory.
 *
 * This function performs the following steps:
 * 1. Checks if the source repository exists. If not, logs an error and returns.
 * 2. Checks if the destination directory already exists. If so, logs an error and returns.
 * 3. Creates the destination directory.
 * 4. Copies the contents of the source repository's `.simple-vcs` directory to the destination's `.simple-vcs` directory.
 * 5. Logs a success message indicating the repository has been cloned.
 */
export function clone(source: string, destination: string) {
  if (!fs.existsSync(source)) {
    console.error(`Source repository '${source}' does not exist`);
    return;
  }

  if (fs.existsSync(destination)) {
    console.error(`Destination '${destination}' already exists`);
    return;
  }

  fs.mkdirSync(destination);
  copyDirectory(path.join(source, '.simple-vcs'), path.join(destination, '.simple-vcs'));

  console.log(`Cloned repository from '${source}' to '${destination}'`);
}

function copyDirectory(source: string, destination: string) {
  fs.mkdirSync(destination, { recursive: true });
  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

