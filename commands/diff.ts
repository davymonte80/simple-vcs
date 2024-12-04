import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export function diff(branch1: string, branch2: string) {
  const repoPath = path.join(process.cwd(), '.simple-vcs');
  
  if (!fs.existsSync(repoPath)) {
    console.error('Not a simple-vcs repository');
    return;
  }

  const branch1Path = path.join(repoPath, 'refs', 'heads', branch1);
  const branch2Path = path.join(repoPath, 'refs', 'heads', branch2);

  if (!fs.existsSync(branch1Path) || !fs.existsSync(branch2Path)) {
    console.error('One or both branches do not exist');
    return;
  }

  const commit1 = fs.readFileSync(branch1Path, 'utf-8').trim();
  const commit2 = fs.readFileSync(branch2Path, 'utf-8').trim();

  const tree1 = getTreeFromCommit(repoPath, commit1);
  const tree2 = getTreeFromCommit(repoPath, commit2);

  console.log(`Diff between ${branch1} and ${branch2}:`);
  Object.keys({ ...tree1, ...tree2 }).forEach(file => {
    if (tree1[file] !== tree2[file]) {
      if (!tree1[file]) {
        console.log(`Added: ${file}`);
      } else if (!tree2[file]) {
        console.log(`Deleted: ${file}`);
      } else {
        console.log(`Modified: ${file}`);
        const diff = execSync(`diff <(echo "${getFileContent(repoPath, tree1[file])}") <(echo "${getFileContent(repoPath, tree2[file])}")`, { shell: '/bin/bash' }).toString();
        console.log(diff);
      }
    }
  });
}

function getTreeFromCommit(repoPath: string, commitHash: string): { [key: string]: string } {
  const commitContent = fs.readFileSync(path.join(repoPath, 'objects', commitHash), 'utf-8');
  const treeHash = commitContent.split('\n')[0].split(' ')[1];
  const treeContent = fs.readFileSync(path.join(repoPath, 'objects', treeHash), 'utf-8');
  return Object.fromEntries(treeContent.split('\n').map(line => line.split(' ').reverse()));
}

function getFileContent(repoPath: string, hash: string): string {
  return fs.readFileSync(path.join(repoPath, 'objects', hash), 'utf-8');
}

