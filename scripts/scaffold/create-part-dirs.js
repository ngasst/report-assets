const fs = require('fs-extra');
const path = require('path');

module.exports = (mainpath, pnames) => {
    return new Promise((resolve, reject) => {
        let proms = pnames.map((pname) => {
            let ppath = path.join(mainpath, pname);
            return new Promise((resolve, reject) => {
                fs.ensureDir(ppath, (err) => {
                    if (err)
                        reject(err);
                    resolve(ppath);
                });
            });
        });

        Promise.all(proms)
            .then(partspaths => resolve(partspaths))
            .catch(err => reject(err));
    });
}