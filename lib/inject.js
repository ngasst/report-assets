const fs = require('fs-extra');
const path = require('path');

module.exports = inject = (basetr, name, type) => {
    return new Promise((resolve, reject) => {
        let p = path.resolve('./assets/'+name);
        fs.readFile(p, (err, data) => {
            if (err)
                reject(err);
                  
            let datatr = data.toString();

            let fullstr = basetr.replace(`<!--inject:${type}-->`, datatr);
            resolve(fullstr);
        });
    });
}