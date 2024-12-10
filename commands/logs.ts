import fs from 'fs';
import path from 'path';

// Utility function to safely read a file and return its content as a string
function readFileSafe(filePath: string) {
  try {
    // Attempt to read the file and trim any whitespace
    return fs.readFileSync(filePath, 'utf-8').trim();
  } catch {
    // Return null if the file does not exist or cannot be read
    return null;
  }
}

// Utility function to parse a commit file's content
function parseCommit(content: string) {
  const lines = content.split('\n'); // Split the content into lines
  const message = lines.find(line => !line.startsWith('parent ')); // Find the first line that isn't a parent reference
  const parentMatch = content.match(/parent (\w+)/); // Extract the parent hash if present
  return {
    message: message || 'No commit message', // Default message if none is found
    parent: parentMatch ? parentMatch[1] : null, // Extract parent commit hash or return null
  };
}

// Main function to log the commit history of a simple VCS repository

export function log() {
    // Define the repository's root path
  const repoPath = path.join(process.cwd(), '.simple-vcs');
  // Check if the repository exists
  if (!fs.existsSync(repoPath)) {
    console.error('Not a simple-vcs repository');
    return;
  }
  // Path to the HEAD file that contains the current branch or commit
  const headPath = path.join(repoPath, 'HEAD');
  const head = readFileSafe(headPath); // Safely read the HEAD file
  if (!head) {
    console.error('HEAD file is missing or corrupt'); // Log an error if the HEAD file cannot be read
    return;
  }

  // Determine the current commit:
  // If HEAD points to a branch, resolve it to the commit hash
  let currentCommit = head.startsWith('ref: ') 
    ? readFileSafe(path.join(repoPath, head.slice(5))) 
    : head;

  // Loop through the commit history, starting from the current commit
  while (currentCommit) {
    // Path to the file that represents the current commit
    const commitPath = path.join(repoPath, 'objects', currentCommit);
    const commitContent = readFileSafe(commitPath); // Safely read the commit file

    if (!commitContent) {
      console.error(`Commit file not found: ${commitPath}`); // Log an error if the commit file is missing
      break;
    }

    // Parse the commit content to extract its message and parent
    const { message, parent } = parseCommit(commitContent);

    // Log the commit hash and message
    console.log(`Commit: ${currentCommit}`);
    console.log(`Message: ${message}`);
    console.log('');
    
    // Update the current commit to the parent for the next iteration
    currentCommit = parent;
  }
}