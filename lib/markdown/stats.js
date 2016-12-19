const util = require('util');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const md = require('markdown').markdown
const timsort = require('timsort');
const flatten = require('../flatten');



function parseChapters(outline) {
    return new Promise((resolve, reject) => {
        let parts = outline.parts.map(p => {
            let chaps = p.chapters.map(c => {
                if(!fs.existsSync(c.path))
                    return Object.assign(c, {stats: {wordcount: 0, occurence: []}});
                let rawtext = fs.readFileSync(c.path, 'utf8');

                if (typeof rawtext === 'undefined')
                    return Object.assign(c, {stats: {wordcount: 0, occurence: []}});
                
                let mdtext = md.parse(rawtext.toString());
                let mdflat = flatten(mdtext);
                let mdnoobj = mdflat.filter(val => typeof val !== 'object');
                let mdfiltered = mdnoobj.filter(val => ['em', 'para', 'markdown', 'strong', 'hr', 'header', 'blockquote'].indexOf(val) < 0).filter(val => val.match(/(\d{1,2})/) === null);
                let txt = mdfiltered.reduce((acc, curr) => {
                    return acc.concat(`\r\n${curr}`);
                }, ``);
                let stats = getStats(txt);
                return Object.assign(c, {stats: stats});
            });
            return Object.assign(p, {chapters: chaps});
        });
        let finalParts = parts.map(p => {
            let wc = p.chapters.map(c => typeof c.stats === 'undefined' ? 0 : c.stats.wordcount).reduce((acc, curr) => acc + curr, 0);
            let occurence = p.chapters.map(c => typeof c.stats === 'undefined' ? [{key: 'empty', value: 0}] : c.stats.occurence).reduce((acc, curr) => acc.concat(curr), []);
            let words = occurence.map(v => v.key);
            words = flatten(words);
            let longest = words.reduce((acc, curr) => {
                 return (curr.length > acc.length) ? curr : acc;
            }, ``);
            let shortest = words.reduce((acc, curr) => {
                return (curr.length < acc.length) ? curr : acc;
            }, `aaaaaaaaaaaaaaaaaa`);
            return Object.assign(p, {wordcount: wc, shortest: shortest, longest: longest});
        });
        let wordcount = flatten(finalParts.map(p => p.wordcount)).reduce((acc, curr) => acc+curr, 0);
        let out = Object.assign(outline, {parts: finalParts, wordcount: wordcount});
        resolve(out);
    });
}

function getStats(text) {
    let stats = {};
    let counts = new Map();

    const regexp = /[ \t\n\r]+/g;

    let words = text.trim().split(regexp);
    let count = words.length || 0;
    //console.log(count);
    
    for(let i = 0; i < count; i++) {
        let word = words[i];

        if(!word)
            return;

        if(word) {
            counts.set(word, (counts.get(word) || 0)+1);
            //wc++;
        }
    }

    let occurrences = [];
    let commonWords = ['a', 'the', 'her', 'his', 'to', 'a',
                        'he', 'she', 'of', 'in'];

    for (let [key, value] of counts) {
        if (commonWords.map(v => v.toLowerCase()).indexOf(key.toLowerCase()) < 0 && value > 3 && key.length > 3)
            occurrences.push({key: key, value: value});
    }
    stats.wordcount = count;
    stats.occurence = occurrences;
    
    return stats;

}

function attachPaths(outline) {
    return new Promise((resolve, reject) => {
        let partTitles = outline.parts.map(p => p.title).map(t => t.toLowerCase().replace(/[\s+]/g, '-')).map((p, i) => `${i+1}-${p}`);
        
        let paths = partTitles.map((p, i) => {
            let chapterTitles = outline.parts[i].chapters.map(c => c.title).map(t => `${t}.md`);
            return chapterTitles.map(ct => path.resolve(`${partTitles[i]}/${ct}`));
        });
        
        let parts = outline.parts
            .map((p, pi) => {
                let chaps = p.chapters.map((c, ci) => Object.assign(c, {path: paths[pi][ci]}));
                return Object.assign(p, {chapters: chaps});
            });

        resolve(Object.assign(outline, {parts: parts}));
    });
}

module.exports = getOutlineStats = (outline) => {
    return new Promise((resolve, reject) => {
        Promise.resolve(attachPaths(outline))
        .then(withPaths => parseChapters(withPaths))
        .then(outWithStats => resolve(outWithStats))
        .catch(err => reject(err));
    });
}