import fs from 'fs';
import path from 'path';

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

