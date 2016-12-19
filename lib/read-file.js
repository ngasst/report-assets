const chalk = require('chalk');
const fs = require('fs');

module.exports = read = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
			if (err)
				reject(err);

            resolve(data.toString());
		});
    });
}