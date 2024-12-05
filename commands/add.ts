import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

