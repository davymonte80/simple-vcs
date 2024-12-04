#!/usr/bin/env node
import { program } from 'commander';
import { init } from "./commands/init";
import { add } from "./commands/add";
import { commit } from './commands/commit';
import { log } from './commands/logs';
import { branch } from './commands/branch';
import { merge } from './commands/merge';
import { diff } from './commands/diff';
import { clone } from './commands/clone';

program
  .version('1.0.0')
  .description('A simple version control system');

program
  .command('init')
  .description('Initialize a new repository')
  .action(init);

program
  .command('add <files...>')
  .description('Add file(s) to the staging area')
  .action(add);

program
  .command('commit <message>')
  .description('Commit staged changes')
  .action(commit);

program
  .command('log')
  .description('Show commit history')
  .action(log);

program
  .command('branch [name]')
  .description('Create a new branch or list existing branches')
  .action(branch);

program
  .command('merge <branch>')
  .description('Merge a branch into the current branch')
  .action(merge);

program
  .command('diff <branch1> <branch2>')
  .description('Show differences between two branches')
  .action(diff);

program
  .command('clone <source> <destination>')
  .description('Clone a repository')
  .action(clone);

program.parse(process.argv);

