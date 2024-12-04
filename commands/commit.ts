import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export function commit(message: string) {
  const repoPath = path.join(process.cwd(), '.simple-vcs');
  
  if (!fs.existsSync(repoPath)) {
    console.error('Not a simple-vcs repository');
    return;
  }

  const indexPath = path.join(repoPath, 'index');
  if (!fs.existsSync(indexPath)) {
    console.error('Nothing to commit');
    return;
  }

  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  const treeContent = Object.entries(index).map(([file, hash]) => `${hash} ${file}`).join('\n');
  const treeHash = crypto.createHash('sha1').update(treeContent).digest('hex');
  fs.writeFileSync(path.join(repoPath, 'objects', treeHash), treeContent);

  const headPath = path.join(repoPath, 'HEAD');
  const head = fs.readFileSync(headPath, 'utf-8').trim();
  let parentCommit = '';

  if (head.startsWith('ref: ')) {
    const branchPath = path.join(repoPath, head.slice(5));
    if (fs.existsSync(branchPath)) {
      parentCommit = fs.readFileSync(branchPath, 'utf-8').trim();
    }
  } else {
    parentCommit = head;
  }

  const commitContent = `tree ${treeHash}\nparent ${parentCommit}\n\n${message}`;
  const commitHash = crypto.createHash('sha1').update(commitContent).digest('hex');
  fs.writeFileSync(path.join(repoPath, 'objects', commitHash), commitContent);

  if (head.startsWith('ref: ')) {
    fs.writeFileSync(path.join(repoPath, head.slice(5)), commitHash);
  } else {
    fs.writeFileSync(headPath, commitHash);
  }

  console.log(`Committed changes: ${commitHash}`);
}

