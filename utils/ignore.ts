import fs from 'fs';
import path from 'path';
import ignore from 'ignore';

export function shouldIgnore(file: string): boolean {
  const repoPath = path.join(process.cwd(), '.simple-vcs');
  const ignorePath = path.join(repoPath, '.gitignore');

  if (!fs.existsSync(ignorePath)) {
    return false;
    }
  // ```

  const ignoreContent = fs.readFileSync(ignorePath, 'utf-8');
  const ig = ignore().add(ignoreContent);

  return ig.ignores(file);
}

//This utility function can be used in the `add` command to filter out ignored files:

// ```typescript file="commands/add.ts"
// import { shouldIgnore } from '../utils/ignore';

// // ... existing code ...

// files.forEach(file => {
//   if (shouldIgnore(file)) {
//     console.log(`Ignoring file: ${file}`);
//     return;
//   }
// });

