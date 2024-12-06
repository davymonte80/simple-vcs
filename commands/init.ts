/**
 * Initializes a new simple version control system repository.
 * 
 * This function creates the necessary directory structure and files for a new repository.
 * It will create a `.simple-vcs` directory in the current working directory.
 * 
 *
 * If a repository already exists in the current working directory, an error message will be logged and the function will return early.
 * 
 */
import fs from 'fs';
import path from 'path';

export function init() {
  const repoPath = path.join(process.cwd(), '.simple-vcs');
  
  if (fs.existsSync(repoPath)) {
    console.error('Repository already exists');
    return;
  }

  fs.mkdirSync(repoPath);
  fs.mkdirSync(path.join(repoPath, 'objects'));
  fs.mkdirSync(path.join(repoPath, 'refs'));
  fs.mkdirSync(path.join(repoPath, 'refs', 'heads'));

  fs.writeFileSync(path.join(repoPath, 'HEAD'), 'ref: refs/heads/master\n');
  fs.writeFileSync(path.join(repoPath, '.gitignore'), '');

  console.log('Initialized empty repository');
}

