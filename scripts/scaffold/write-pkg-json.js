const fs = require('fs-extra');
const path = require('path');

module.exports = (maindir, title) => {
    let mintitle = title.toLowerCase().split(' ').map(w => w.trim()).join('-');
    let data = `
    {
        "name": "${mintitle}",
        "version": "1.0.0",
        "main": "index.js",
        "repository": "https://gasst@bitbucket.org/gasst/${mintitle}.git",
        "author": "Gaston Ndanyuzwe <ndanyuzwe@hotmail.com>",
        "license": "MIT",
        "scripts": {
            "start": "nodemon ../../report-assets/start",
            "scaffold":"node ../../report-assets/scripts/scaffold"
        },
        "dependencies": {
            "chalk": "^1.1.3",
            "fs-extra": "^1.0.0",
            "gulp": "gulpjs/gulp#4.0",
            "gulp-concat": "^2.6.1",
            "gulp-load-plugins": "^1.4.0",
            "gulp-nodemon": "^2.2.1",
            "gulp-sass": "^3.0.0",
            "gulp-util": "^3.0.7",
            "nodemon": "^1.11.0",
            "rimraf": "^2.5.4"
            }
        }

    `;

    return new Promise((resolve, reject) => {
        let p = path.join(maindir, 'package.json');
        fs.ensureFile(p, (err) => {
            if (err)
                reject(err);
            fs.writeFile(p, data, (err) => {
                if (err)
                    reject(err);
                resolve();
            });
        });
    });
}