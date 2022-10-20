import inquirer from 'inquirer';
import fs, { lstatSync } from 'fs';
import path from 'path';

const mainPath = 'cli.mjs';

const getDir = (path) => lstatSync(path).isDirectory();

const cli = (dir) => {
  inquirer
    .prompt([
      {
        name: 'dirName',
        message: 'Выберите папку для просмотра или вернитесь назад',
        type: 'list',
        choices: dir,
      },
    ])
    .then((choice) => {
      if (choice.dirName === '..') {
        actualPath = path.dirname(actualPath);
        readDir(actualPath);
      } else if (choice.dirName !== '..' && choice.dirName !== 'end') {
        actualPath = path.join(actualPath, choice.dirName);
        if (getDir(actualPath)) {
          readDir(actualPath);
        } else {
          const fileContent = fs.readFileSync(actualPath, 'utf-8');
          console.log(fileContent);
          actualPath = path.dirname(actualPath);
          readDir(actualPath);
        }
      } else {
        // if (choice.dirName === 'end') {
        console.log('Приложение было закрыто');
      }
    });
};

const readDir = (pathDir) => {
  const listDir = fs.readdirSync(pathDir);
  const action = ['..', ...listDir, 'end'];
  cli(action);
};

let actualPath = path.resolve(path.dirname(mainPath));
readDir(actualPath);
