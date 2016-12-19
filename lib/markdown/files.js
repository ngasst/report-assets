const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

module.exports = readmd = (folderPath) => {
    return new Promise((resolve, reject) => {
        fs.readdir(folderPath, (err, files) => {
            if (err){
                reject(err); 
            }
            let dirs = files.filter(f => fs.statSync(f).isDirectory() && f !== '.git' && f !== 'node_modules');

            let proms = dirs.map(d => {
                return new Promise((resolve, reject) => {
                    let p = path.resolve('./'+d);
                    fs.readdir(p, (err, fnames) => {
                        if (err)
                            reject(err);
                        resolve(fnames.map(f => `${d}/${f}`));
                    });
                });
            });

            Promise.all(proms)
                .then(files => {
                    let flat = [].concat(...files);
                    let final = flat.filter(f => f.includes('outline.md'));
                    resolve(final);
                })
                .catch(err => reject(err));
        });
    });
}