let gulp = require("gulp");
let chalk = require("chalk");
let rimraf = require("rimraf");
const fs = require('fs-extra');
const path = require('path');
const outlineFunctions = require('../../report-assets/lib');


const $ = require("gulp-load-plugins")();

// --------------------------------
// Public Tasks

gulp.task("clean:outline", cb => {
	rimraf("./outline.md", cb);
	//rimraf("./java", cb);
});

gulp.task("clean:manuscript", cb => {
	rimraf("./manuscript.md", cb);
	//rimraf("./java", cb);
});

gulp.task("clean", gulp.parallel("clean:outline", "clean:manuscript"));

//gulp.task("clean", gulp.parallel("clean:outline", "clean:docx", "clean:rtf", "clean:manuscript"));

gulp.task("sass", () => {
	return gulp.src('./assets/sass/**/*.scss')
		.pipe($.sass.sync().on('error', $.sass.logError))
		.pipe($.concat('outline.css'))
		.pipe(gulp.dest('./assets/css'));
});


gulp.task("compile:outline", (cb) => {
	rimraf("./outline.md", cb);
	return gulp.src(['./**/*/*outline.md', '!./outline.md'])
		.pipe($.concat('outline.md'))
		.pipe(gulp.dest('./'));
});

gulp.task("compile:manuscript", (cb) => {
	rimraf("./manuscript.md", cb);
	return gulp.src(['./**/*/*.md', '!./**/*outline.md', '!./node_modules/**/*.md'])
		.pipe($.concat('manuscript.md'))
		.pipe(gulp.dest('./'));
});


gulp.task("to:json", (done) => {
	return outlineFunctions.toJson(path.resolve('.'), path.resolve('./assets/data'));
});

gulp.task("to:js", (done) => {
	return outlineFunctions.toJs(path.resolve('.'), path.resolve('./assets/data'));	
});

/// GENERATE HTML
gulp.task("html:outline", (done) => {
	return generateHtml(path.resolve('./assets/html/base.html'), 'outline');
});
/// GENERATE HTML

gulp.task("watch:outline", () => {
	let watcher = gulp.watch(['./**/*outline.md', '!./outline.md'], gulp.series('compile:outline', 'to:json', 'to:js', 'html:outline'));
	watcher.on('change', (event) => {
		console.log(`[File ${chalk.red(event)} was ${chalk.bold('modified')}]`);
	});
});

gulp.task("watch:sass", () => {
	let watcher = gulp.watch(['../../report-assets/sass/**/*.scss'], gulp.parallel('sass'));
	watcher.on('change', (event) => {
		console.log(`[File ${chalk.red(event)} was ${chalk.bold('modified')}]`);
	});
});

gulp.task("watch:manuscript", () => {
	let watcher = gulp.watch(['./**/*.md', '!*outline.md', '!*manuscript.md', '!./**/*outline.md'], gulp.parallel('compile:manuscript'));
	watcher.on('change', (event) => {
		console.log(`[File ${chalk.red(event)} was ${chalk.bold('modified')}]`);
	});
});

gulp.task("watch:assets", () => {
	let watcher = gulp.watch(['../../report-assets/html/**/*.html', '../../report-assets/css/**/*.css', '../../report-assets/js/**/*.js'], gulp.series('copy:assets', 'html:outline'));
	watcher.on('change', (event) => {
		console.log(`[File ${chalk.red(event)} was ${chalk.bold('modified')}]`);
	});
})

gulp.task("watch", gulp.parallel("watch:outline", "watch:manuscript", "watch:sass", "watch:assets"));

gulp.task("copy:assets", (done) => {
	let assets = [
			'../../report-assets/js/**/*.js',
			'../../report-assets/html/**/*.html'
		];
	return gulp.src(assets, {base: '../../report-assets/'})
			.pipe(gulp.dest('./assets', {cwd: process.cwd()}));
});

gulp.task("default", gulp.series("copy:assets", "watch"));

//FUNCTIONS

function generateHtml(base, name) {
	const readbase = require('../../report-assets/lib/read-file');
	const inject = require('../../report-assets/lib/inject');
	const write = require('../../report-assets/lib/write-file');
	return new Promise((resolve, reject) => {
		Promise.resolve(readbase(base))
			.then(basestr => inject(basestr, `html/${name}.html`, 'partial'))
			.then(full => inject(full, `js/${name}.js`, 'js'))
			.then(full => inject(full, `css/${name}.css`, 'css'))
			.then(final => write(path.join(process.cwd(), `./assets/${name}.html`), final))
			.then(() => console.log(chalk.magenta(`HTML written with success at ${process.cwd()}/assets/${name}.html`)))
			.catch(err => reject(err));		
	});
}
