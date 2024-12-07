import fs from 'fs';
import path from 'path';

export function merge(branchName: string) {

  // Get the path to the repository
  const repoPath = path.join(process.cwd(), '.simple-vcs'); 
  

  if (!fs.existsSync(repoPath)) {
    // Check if the repository exists
    console.error('Not a simple-vcs repository'); 
    return;
  }

// Get the path to the HEAD file
  const headPath = path.join(repoPath, 'HEAD'); 
  // Read the current HEAD
  const head = fs.readFileSync(headPath, 'utf-8').trim(); 

  let currentBranch = '';
  // Check if HEAD is pointing to a branch
  if (head.startsWith('ref: ')) {
    // Extract the current branch name from HEAD
    currentBranch = head.slice(5).split('/').pop() || ''; 
  } else {
    // If HEAD is not a reference, print an error message
    console.error('Not on a branch'); 
    return;
  }

  // Get the path to the HEAD file
  const branchPath = path.join(repoPath, 'refs', 'heads', branchName);

  if (!fs.existsSync(branchPath)) {
    // Check if the branch exists
    console.error(`Branch '${branchName}' does not exist`); 
    return;
  }


  // Read the current commit hash from the current branch
  const currentCommit = fs.readFileSync(path.join(repoPath, head.slice(5)), 'utf-8').trim();
  // Read the commit hash from the branch to be merged
  const branchCommit = fs.readFileSync(branchPath, 'utf-8').trim();
// Check if the current branch is already up-to-date with the branch to be merged

  if (currentCommit === branchCommit) {
    // If the commits are the same, print a message
    console.log('Already up-to-date'); 
    return;
  }

  // Simplified merge strategy: update the current branch to the commit of the branch being merged
  fs.writeFileSync(path.join(repoPath, head.slice(5)), branchCommit);
  // Print a success message
  console.log(`Merged branch '${branchName}' into '${currentBranch}'`); 
}
