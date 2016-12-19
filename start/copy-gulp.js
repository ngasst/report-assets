const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = () => {
    let p = path.join(process.cwd(), '..', '..', 'report-assets', 'gulpfile.js');
    return new Promise((resolve, reject) => {
        fs.readFile(p, (err, data) => {
            if (err)
                reject(err);
            let pout = path.resolve(path.join(process.cwd(), 'gulpfile.js'));
            fs.writeFile(pout, data.toString(), (err) => {
                if (err)
                    reject(err);
                console.log(chalk.green(`Gulpfile ${p} copied to ${pout}`));
                resolve();
            });
        });
    });
}