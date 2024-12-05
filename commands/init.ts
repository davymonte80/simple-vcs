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

