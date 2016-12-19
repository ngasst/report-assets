const fs = require('fs-extra');
const path = require('path');
const flatten = require('../../lib/flatten');

module.exports = (ppaths, numchaps) => {
    return new Promise((resolve, reject) => {
        let flatpaths = flatten(ppaths);

        let proms = flatpaths.map((fp) => {
            let innerproms = [];
            for (let i = 1; i < parseInt(numchaps) + 1; i++) {
                let prom = new Promise((resolve, reject) => {
                    let chapath = path.join(fp, `${i}.md`);
                    fs.ensureFile(chapath, (err) => {
                        if (err)
                            reject(err);
                        resolve(chapath);
                    });
                });

                innerproms.push(prom);
            }

            //add outline per part
            innerproms.push(new Promise((resolve, reject) => {
                let outpath = path.join(fp, 'outline.md');
                fs.ensureFile(outpath, (err) => {
                    if (err)
                        reject(err);
                    resolve(outpath);
                });
            }));
        });

        let flatproms = flatten(proms);

        Promise.all(flatproms)
        .then(chapaths => resolve(chapaths))
        .catch(err => reject(err));
    });
}