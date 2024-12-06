import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Adds the specified files to the staging area of the simple-vcs repository.
 *
 * This function reads the content of each specified file, computes its SHA-1 hash,
 * and stores the file content in the repository's objects directory if it doesn't
 * already exist. It then updates the index file with the mapping of file paths to
 * their corresponding hashes.
 *
 * @param files - An array of file paths to be added to the staging area.
 *
 * @remarks
 * - If the current working directory is not a simple-vcs repository, an error message
 *   is logged and the function returns early.
 * - If any of the specified files do not exist, an error message is logged for each
 *   missing file.
 * - The index file is updated with the new file hashes and saved in a pretty-printed
 *   JSON format.
 */
export function add(files: string[]): void {
  const repoPath = path.join(process.cwd(), '.simple-vcs');
  
  if (!fs.existsSync(repoPath)) {
    console.error('Not a simple-vcs repository');
    return;
  }

  const indexPath = path.join(repoPath, 'index');
  let index: { [key: string]: string } = {};

  if (fs.existsSync(indexPath)) {
    index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  }

  files.forEach(file => {
    if (!fs.existsSync(file)) {
      console.error(`File not found: ${file}`);
      return;
    }

    const content = fs.readFileSync(file);
    const hash = crypto.createHash('sha1').update(content).digest('hex');
    const objectPath = path.join(repoPath, 'objects', hash);

    if (!fs.existsSync(objectPath)) {
      fs.writeFileSync(objectPath, content);
    }

    index[file] = hash;
  });

fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

 // console.log(`Added ${files.length} file(s) to the staging area`);
}

