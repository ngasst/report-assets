const files = require('./files');
const jsFile = require('./js-datafile');
const parse = require('./parse');
const jsonFile = require('./json-datafile');
const stats = require('./stats');
const transform = require('./transform');
const chalk = require('chalk');

function getJsDatafile(parentFolderPath, outputPath) {
    return new Promise((resolve, reject) => {
        Promise.resolve(files(parentFolderPath))
            .then(files => parse(files))
            .then(jsRawData => transform(jsRawData, true))
            .then(outline => stats(outline))
            .then(final => jsFile(outputPath, final))
            .then(() => {
                chalk.green('Javascript datafile generated at ' + outputPath);
                resolve();
            })
            .catch(err => reject(err));
    });
}

function getJsonDatafile(parentFolderPath, outputPath) {
    return new Promise((resolve, reject) => {
        Promise.resolve(files(parentFolderPath))
            .then(files => parse(files))
            .then(jsRawData => transform(jsRawData, true))
            .then(outline => stats(outline))
            .then(final => jsonFile(outputPath, final))
            .then(() => {
                chalk.green('JSON datafile generated at ' + outputPath);
                resolve();
            })
            .catch(err => reject(err));
    });
}

module.exports = {jsFile: getJsDatafile, jsonFile: getJsonDatafile}