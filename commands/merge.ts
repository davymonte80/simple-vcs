import fs from 'fs';
import path from 'path';

export function merge(branchName: string) {
  // Get the path to the .simple-vcs directory in the current working directory
  const repoPath = path.join(process.cwd(), '.simple-vcs');
    // Check if the .simple-vcs directory exists
  if (!fs.existsSync(repoPath)) {
    console.error('Not a simple-vcs repository');
    return;
  }

  const headPath = path.join(repoPath, 'HEAD');
   // Read the content of the HEAD file and trim any whitespace
  const head = fs.readFileSync(headPath, 'utf-8').trim();
  let currentBranch = '';
  // Check if HEAD is pointing to a branch
  if (head.startsWith('ref: ')) {
    currentBranch = head.slice(5).split('/').pop() || '';
  } else {
    console.error('Not on a branch');
    return;
  }
  // Get the path to the HEAD file
  const branchPath = path.join(repoPath, 'refs', 'heads', branchName);
  if (!fs.existsSync(branchPath)) {
    console.error(`Branch '${branchName}' does not exist`);
    return;
  }
  // Read the current commit hash from the current branch
  const currentCommit = fs.readFileSync(path.join(repoPath, head.slice(5)), 'utf-8').trim();
  // Read the commit hash from the branch to be merged
  const branchCommit = fs.readFileSync(branchPath, 'utf-8').trim();
// Check if the current branch is already up-to-date with the branch to be merged
  if (currentCommit === branchCommit) {
    console.log('Already up-to-date');
    return;
  }

  // Simplified merge strategy
  fs.writeFileSync(path.join(repoPath, head.slice(5)), branchCommit);
  console.log(`Merged branch '${branchName}' into '${currentBranch}'`);
}

