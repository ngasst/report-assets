const md = require('markdown').markdown;
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const util = require('util');
const flatten = require('./flatten');

function transform(filepath) {
    return new Promise((resolve, reject) => {
        fs.readdir(filepath, (err, files) => {
            if (err){
                console.log(err);
                process.exit();    
            }
            let dirs = files.filter(f => fs.statSync(path.resolve(f)).isDirectory() && f !== '.git' && f !== 'node_modules');

            let proms = dirs.map(d => {
                return new Promise((resolve, reject) => {
                    let p = path.resolve('./'+d);
                    fs.readdir(p, (err, fnames) => {
                        if (err)
                            reject(err);
                        resolve(fnames.map(f => `${d}/${f}`));
                    });
                });
            });

            Promise.all(proms)
                .then(files => {
                    let flat = [].concat(...files);
                    let final = flat.filter(f => f.includes('outline.md'));
                    resolve(final);
                })
                .catch(err => reject(err));
        });
    });
}

function writeToFile(p, data) {
    let pa = path.join(p, 'outline.json');
    return new Promise((resolve, reject) => {
        fs.outputJSON(pa, data, (err) => {
            if (err)
                reject(err);
            console.log(chalk.green(chalk.bold('JSON outline saved at ' + pa)))
            resolve();
        });
    })
}

function writeJs(p, data) {
    let pa = path.join(p, 'outline-data.js');
    return new Promise((resolve, reject) => {
        fs.writeFile(pa, `const data = ${util.inspect(data, false, 7, false)}\r\nmodule.exports = data;`, (err) => {
            if (err)
                reject(err);
            console.log(chalk.green(chalk.bold('outline data saved as JS Object at ' + pa)))
            resolve();
        });
    })
}

function format(js, hasparts) {
    
    return new Promise((resolve, reject) => {
        if (hasparts) {
            let parts = js.map((p, i) => {
                let part = p.filter((el, i) => i > 1);
                let title = part[0][2];
                let quote = part[1][2];
                let filtered = part.filter((el, i) => i > 0);
                return {
                        title: title,
                        quote: quote,
                        chapters: extractChapters(filtered)
                    }
            });
            let viewpointclasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((v, i) => `viewpoint-${i+1}`);
            let flattened = flatten(parts.map(p => p.chapters.map(c => c.viewpoint)).sort());
            let viewpoints = flattened.reduce((acc, curr) => {
                if (acc.indexOf(curr) < 0)
                    acc.push(curr);
                return acc;
            }, []);
            
            let bookTitle = js.filter((e, i) => i < 1)[0].filter((h, i) => i < 1)[0][2];
            
            let manuscript = {
                title: bookTitle,
                parts: parts.map(part => {
                    let newchaps = part.chapters.map(chapter => Object.assign(chapter, {viewpointClass: viewpointclasses[viewpoints.indexOf(chapter.viewpoint)]}));
                    return Object.assign(part, {chapters: newchaps});
                })
            }
            resolve(manuscript);
        }
        resolve(extractChapters(js));
    });
}

function extractChapters(js) {
    let markup = js.filter((v,i) => i > 0).filter(v => v[0] !== 'hr');
    let outline = markup.map((el, i) => {
        let title = markup.filter(el => el[0] === 'header' && typeof el[1].level !== 'undefined' && el[1].level === 2 && el[2].toLowerCase() !== 'summary')[i];
        let summaryidx = markup.indexOf(markup.filter(el => el[0] === 'header' && typeof el[1].level !== 'undefined' && el[2].toLowerCase().includes('summary'))[i]);
        let summary = markup[summaryidx + 1];

        let pointsidx = markup.indexOf(markup.filter(el => el[0] === 'header' && typeof el[1].level !== 'undefined' && el[2].toLowerCase().includes('import') && el[2].toLowerCase().includes('point'))[i]);
        let points = markup[pointsidx + 1];
        let chapter = {
            title: title,
            summary: summary,
            points: points
        }
        //console.log('chapter num ', i, chapter);
        return chapter;
    });
    let numchaps = markup.map((el, i) => {
        let title = markup.filter(el => el[0] === 'header' && typeof el[1].level !== 'undefined' && el[1].level === 2 && el[2].toLowerCase() !== 'summary')[i];
        return typeof title === 'undefined' ? undefined : i;
    }).filter(v => typeof v !== 'undefined');
    
    let final = outline.filter((v, i) => i <= numchaps.length).filter(v => typeof v.title !== 'undefined');
    
    let result = final.map(node => {
        //console.log(node.points);
        return {
            title: node.title[2],
            summary: node.summary[1],
            points: node.points[0] === 'bulletlist' ? [].concat(...node.points.filter((v, i) => i > 0).map(v => v[1]).map(v => v)).filter(v => v !== 'para' && typeof v !== 'undefined') : []
        }
    });

    let transformed = result.map(chapter => {
        let tmatch = chapter.title.match(/([0-9a-zA-Z][^:]*)/, '');
        let title = tmatch === null ? chapter.title : tmatch[0];
        let match = chapter.title.match(/([a-zA-Z_-]+)/);
        let viewpoint = match === null ? '' : match[0];
        let flags = (chapter.points.length > 0 && chapter.points[0].includes('{') && chapter.points[0].includes('}')) ? JSON.parse(chapter.points[0]) : {};
        let points = (chapter.points.length > 0 && chapter.points[0].includes('{') && chapter.points[0].includes('}')) ? chapter.points.filter((v, i) => i > 0) : chapter.points

        return {
            title: title,
            viewpoint: viewpoint,
            summary: chapter.summary,
            points: points,
            flags: flags
        }
    });

    return transformed;
}

function toJson(filepaths) {
    return new Promise((resolve, reject) => {
        let proms = filepaths.map(f => {
            return new Promise((resolve, reject) => {
                fs.readFile(path.join('.', f), (err, data) => {
                    if (err)
                        reject(err);
                    let text = data.toString();
                    let js = md.parse(text);
                    resolve(js);
                });
            });
        });

        Promise.all(proms)
        .then(data => {
            resolve(data);
        })
        .catch(err => reject(err));
    });
}

module.exports = {transform: transform, json: toJson, write: writeToFile, format: format, writeJs: writeJs};