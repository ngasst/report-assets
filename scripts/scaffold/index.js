const chp = require('child_process');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const maindir = require('./create-main-dir');
const partdirs = require('./create-part-dirs');
const initialchapters = require('./initial-chapters');

let args = process.argv.filter((a, i) => i > 1);

console.log(args);

let title = typeof args[0] === 'undefined' ? 'untitled' : args[0].toLowerCase().split(' ').map(w => w.trim()).join('-');

let parts = typeof args[1] === 'undefined' ? ['1-untitled', '2-untitled', '3-untitled', '4-untitled'] : args[1].split(',').map((n, i) => `${i+1}-${n.trim().toLowerCase().replace(' ', '-')}`);

let numberChapsPerPart = args[2] || 4;

let p = path.join(process.cwd(), title);

Promise.resolve(maindir(p))
.then(p => {
    console.log(chalk.blue(`Book directory created at ${p}`));
    return p;
})
.then(p => partdirs(p, parts))
.then(ppaths => {
    console.log(chalk.blue(`Parts directories created at ${ppaths}`));
    return ppaths;
})
.then((ppaths) => initialchapters(ppaths, numberChapsPerPart))
.then((finalpaths) => {
    console.log(chalk.green(`Finished creating folders, chapter files, and outline file for project ${title}`));
})
.catch(err => console.log(err));