const chalk = require('chalk');
const copy = require('./copy-gulp');
const launch = require('./launch-gulp');

copy()
    .then(() => {
        launch();
    })
    .catch(err => reject(chalk.red(err.stack)));