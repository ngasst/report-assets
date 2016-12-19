const fs = require('fs-extra');

module.exports = write = (pout, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(pout, data, (err) => {
            if (err)
                reject(err)
            
            resolve();
        });
    });
}