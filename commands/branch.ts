import fs from 'fs';
import path from 'path';

/**
 * Creates a new branch or lists existing branches in a simple-vcs repository.
 *
 * @param {string} [name] - The name of the branch to create. If not provided, lists all branches.
 *
 * @remarks
 * - If the repository is not initialized, it will print an error message.
 * - If the branch name is provided and already exists, it will print an error message.
 * - If the branch name is provided and does not exist, it will create a new branch pointing to the current commit.
 *
 * @example
 * ```typescript
 * // List all branches
 * branch();
 *
 * // Create a new branch named 'feature'
 * branch('feature');
 * ```
 */
export function branch(name?: string) {
  const repoPath = path.join(process.cwd(), '.simple-vcs');
  
  if (!fs.existsSync(repoPath)) {
    console.error('Not a simple-vcs repository');
    return;
  }

  const branchesPath = path.join(repoPath, 'refs', 'heads');

  if (!name) {
    const branches = fs.readdirSync(branchesPath);
    console.log('Branches:');
    branches.forEach(branch => console.log(`  ${branch}`));
    return;
  }

  const headPath = path.join(repoPath, 'HEAD');
  const head = fs.readFileSync(headPath, 'utf-8').trim();
  let currentCommit = '';

  if (head.startsWith('ref: ')) {
    const currentBranchPath = path.join(repoPath, head.slice(5));
    if (fs.existsSync(currentBranchPath)) {
      currentCommit = fs.readFileSync(currentBranchPath, 'utf-8').trim();
    }
  } else {
    currentCommit = head;
  }

  const newBranchPath = path.join(branchesPath, name);
  if (fs.existsSync(newBranchPath)) {
    console.error(`Branch '${name}' already exists`);
    return;
  }

  fs.writeFileSync(newBranchPath, currentCommit);
  console.log(`Created new branch '${name}'`);
}

