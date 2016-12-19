const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');

module.exports = jsonfile = (p, data) => {
    let pa = path.join(p, 'outline.json');
    return new Promise((resolve, reject) => {
        fs.outputJSON(pa, data, (err) => {
            if (err)
                reject(err);
            console.log(chalk.green(chalk.bold('JSON outline saved at ' + pa)))
            resolve();
        });
    })
}