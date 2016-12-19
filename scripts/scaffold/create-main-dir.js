const fs = require('fs-extra');
const chalk = require('chalk');

module.exports = (path) => {
    return new Promise((resolve, reject) => {
        fs.ensureDir(path, (err) => {
            if (err)
                reject(err);
            resolve(path);
        });
    });
}