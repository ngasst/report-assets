const chalk = require('chalk');
const path = require('path');
const mdParser = require('./markdown')

module.exports = {
    toJs: mdParser.jsFile,
    toJson: mdParser.jsonFile
}
