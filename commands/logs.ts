import fs from 'fs';
import path from 'path';

export function log() {
  const repoPath = path.join(process.cwd(), '.simple-vcs');
  
  if (!fs.existsSync(repoPath)) {
    console.error('Not a simple-vcs repository');
    return;
  }

  const headPath = path.join(repoPath, 'HEAD');
  const head = fs.readFileSync(headPath, 'utf-8').trim();
  let currentCommit = '';

  if (head.startsWith('ref: ')) {
    const branchPath = path.join(repoPath, head.slice(5));
    if (fs.existsSync(branchPath)) {
      currentCommit = fs.readFileSync(branchPath, 'utf-8').trim();
    }
  } else {
    currentCommit = head;
  }

  while (currentCommit) {
    const commitPath = path.join(repoPath, 'objects', currentCommit);
    const commitContent = fs.readFileSync(commitPath, 'utf-8');
    const [, , , message] = commitContent.split('\n');
    console.log(`Commit: ${currentCommit}`);
    console.log(`Message: ${message}`);
    console.log('');

    const parentMatch = commitContent.match(/parent (\w+)/);
    currentCommit = parentMatch ? parentMatch[1] : '';
  }
}

