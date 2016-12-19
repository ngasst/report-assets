const transform = require('./transform');
const stats = require('./stats');
const chalk = require('chalk');
const path = require('path');

const toJs = (inpath, outpath) => {
    return new Promise((resolve, reject) => {
		Promise.resolve(transform.transform(inpath))
		.then(files => transform.json(files))
		.then(data => transform.format(data, true))
        .then(outline => stats(outline))
		.then(formatted => transform.writeJs(outpath, formatted))
		.then(() => resolve())
		.catch(err => reject(chalk.red(err)));
	});
}


const toJson = (inpath, outpath) => {
	let bookTitle = 'Untitle (report-assets/lib/index.js)';
    return new Promise((resolve, reject) => {
		Promise.resolve(transform.transform(inpath))
		.then(files => transform.json(files))
		.then(data => transform.format(data, true))
        .then(outline => stats(outline))
		.then(formatted => transform.write(outpath, formatted))
		.then(() => resolve())
		.catch(err => reject(chalk.red(err)));
	});
}

module.exports = {
    toJs: toJs,
    toJson: toJson
}
