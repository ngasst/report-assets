const cp = require('child_process');
const chalk = require('chalk');

module.exports = () => {
    let gulp = cp.spawn('gulp.cmd');

    gulp.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    gulp.stderr.on('data', (data) => {
        console.log(chalk.red(data));
    });

    gulp.on('exit', (code) => {
        console.log(chalk.magenta(`Gulp process exited with code ${code}`));
    });
}