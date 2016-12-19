const md = require('markdown').markdown;
const path = require('path');
const fs = require('fs-extra');

module.exports = mdParse = (filepaths) => {
    return new Promise((resolve, reject) => {
        let proms = filepaths.map(f => {
            return new Promise((resolve, reject) => {
                fs.readFile(path.join('.', f), (err, data) => {
                    if (err)
                        reject(err);
                    let text = data.toString();
                    let js = md.parse(text);
                    resolve(js);
                });
            });
        });

        Promise.all(proms)
        .then(data => {
            resolve(data);
        })
        .catch(err => reject(err));
    });
}