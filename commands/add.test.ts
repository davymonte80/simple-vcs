import fs from 'fs';
import path from 'path';
import { add } from './add';

const repoPath = path.join(process.cwd(), '.simple-vcs');

beforeEach(() => {
  if (!fs.existsSync(repoPath)) {
    fs.mkdirSync(repoPath);
    fs.mkdirSync(path.join(repoPath, 'objects'));
  }
});

afterEach(() => {
  if (fs.existsSync(repoPath)) {
    fs.rmdirSync(repoPath, { recursive: true });
  }
});

test('adds files to the repository', () => {
  fs.writeFileSync('file1', 'content1');
  fs.writeFileSync('file2', 'content2');

  add(['file1', 'file2']);

  // Check if files were added to the index
  const indexPath = path.join(repoPath, 'index');
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
  expect(index).toHaveProperty('file1');
  expect(index).toHaveProperty('file2');

  fs.unlinkSync('file1');
  fs.unlinkSync('file2');
});

test('logs error if not a simple-vcs repository', () => {
  if (fs.existsSync(repoPath)) {
    fs.rmdirSync(repoPath, { recursive: true });
  }

  console.error = jest.fn();

  add(['file1', 'file2']);
  // Check if error message was logged
  expect(console.error).toHaveBeenCalledWith('Not a simple-vcs repository');
});