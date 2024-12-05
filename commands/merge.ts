import fs from 'fs';
import path from 'path';

export function merge(branchName: string) {
  const repoPath = path.join(process.cwd(), '.simple-vcs');
  
  if (!fs.existsSync(repoPath)) {
    console.error('Not a simple-vcs repository');
    return;
  }

  const headPath = path.join(repoPath, 'HEAD');
  const head = fs.readFileSync(headPath, 'utf-8').trim();
  let currentBranch = '';

  if (head.startsWith('ref: ')) {
    currentBranch = head.slice(5).split('/').pop() || '';
  } else {
    console.error('Not on a branch');
    return;
  }

  const branchPath = path.join(repoPath, 'refs', 'heads', branchName);
  if (!fs.existsSync(branchPath)) {
    console.error(`Branch '${branchName}' does not exist`);
    return;
  }

  const currentCommit = fs.readFileSync(path.join(repoPath, head.slice(5)), 'utf-8').trim();
  const branchCommit = fs.readFileSync(branchPath, 'utf-8').trim();

  if (currentCommit === branchCommit) {
    console.log('Already up-to-date');
    return;
  }

  // Simplified merge strategy
  fs.writeFileSync(path.join(repoPath, head.slice(5)), branchCommit);
  console.log(`Merged branch '${branchName}' into '${currentBranch}'`);
}

