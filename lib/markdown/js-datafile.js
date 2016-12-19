const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const util = require('util');

module.exports = datafile = (p, data) => {
    let pa = path.join(p, 'outline-data.js');
    return new Promise((resolve, reject) => {
        fs.writeFile(pa, `const data = ${util.inspect(data, false, 7, false)}\r\nmodule.exports = data;`, (err) => {
            if (err)
                reject(err);
            console.log(chalk.green(chalk.bold('outline data saved as JS Object at ' + pa)))
            resolve();
        });
    })
}