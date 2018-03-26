#!/usr/bin/env node

const shell = require('shelljs');
const inquirer = require('inquirer');
const fs = require('fs');

// Inquirer
const questionList = [
  {
    type: 'input',
    name: 'project_name',
    message: 'Type your project name (Ex. Project Name)',
    validate: (value) => {
      return value !== '' && value !== '\t'
    }
  },
  {
    type: 'input',
    name: 'project_id',
    message: 'Type your project id (Ex. project-id)',
    validate: (value) => {
      return value !== '' && value !== '\t'
    }
  },
  {
    type: 'input',
    name: 'version',
    message: 'Type your app version (Ex. 1.0.0)',
    validate: (value) => {
      return value !== '' && value !== '\t'
    }
  }
]

inquirer.prompt(questionList).then(answers => {
  // Clone git repository
  shell.exec(`git clone https://github.com/tomybudiman/react-app-sass.git ${answers.project_id}`);
  // Read package json
  let packageJson = JSON.parse(fs.readFileSync(`${answers.project_id}/package.json`,'utf8'));
  packageJson['name'] = answers.project_id;
  packageJson['description'] = answers.project_name;
  packageJson['version'] = answers.version;
  // Rewrite package json file
  const newJsonPackage = JSON.stringify(packageJson, null, '\t');
  fs.writeFileSync(`${answers.project_id}/package.json`, newJsonPackage, 'utf8');
  // Installing packages
  console.log('Installing packages, please wait!');
  shell.exec(`cd ${answers.project_id} && npm install`, {silent: true}, (err, stdout, stderr) => {
    if(err === 0){
      console.log('Done!');
    }else{
      console.log(`Exit code: ${err}`);
    }
  });
});
