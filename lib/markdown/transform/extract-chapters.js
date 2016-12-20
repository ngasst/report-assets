const fs = require('fs-extra');
const path = require('path');
const util = require('util');

module.exports = chapters = (js) => {
    let chaparrs = [];

    let buffer = [];
    let i = 0;
    while(i < js.length) {
        if(js[i][0] !== 'hr') {
            if ((typeof js[i][2] !== 'undefined' && typeof js[i][2] === 'string' && js[i][2].toLowerCase().includes('quote')) || js[i][0].toLowerCase().includes('quote') || (js[i][0] === 'header' && typeof js[i][1] === 'object' && js[i][1].level === 1)) {
                //do nothing
            } else {
                buffer.push(js[i]);           
            }
        } else {
            chaparrs.push(buffer);
            buffer = [];
        }
        i = i+1;
    }

    //fs.writeFileSync(path.resolve('./output.json'), util.inspect(formedpart, false, 7));

    let chaps = chaparrs.map(chapter => {
        let title = chapter[0][2];
        let sum = chapter[2][0] === 'para' ? chapter[2][1] : 'None.';
        let summary = sum.split(/\r|\n/).map(p => `<p>${p}</p>`).join('');
        let points = typeof chapter[chapter.indexOf('bulletlist')] === 'undefined' ? [] : chapter[chapter.indexOf('bulletlist')];
        let chap = {
            title: title,
            summary: summary,
            points: points
        }
        return chap;
    });
    

    let transformed = chaps.map(chapter => {
        let tmatch = chapter.title.match(/([0-9a-zA-Z][^:]*)/, '');
        let title = tmatch === null ? chapter.title : tmatch[0];
        let match = chapter.title.match(/([a-zA-Z_-]+)/);
        let viewpoint = match === null ? '' : match[0];
        let flags = (chapter.points.length > 0 && chapter.points[0].includes('{') && chapter.points[0].includes('}')) ? JSON.parse(chapter.points[0]) : {};
        let points = (chapter.points.length > 0 && chapter.points[0].includes('{') && chapter.points[0].includes('}')) ? chapter.points.filter((v, i) => i > 0) : chapter.points

        let transformedChap =  {
            title: title,
            viewpoint: viewpoint,
            summary: chapter.summary,
            points: points,
            flags: flags
        }
        return transformedChap;
    });

    let viewpointclasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((v, i) => `viewpoint-${i+1}`);
    let flattened = flatten(transformed.map(c => c.viewpoint)).sort();
    let viewpoints = flattened.reduce((acc, curr) => {
        if (acc.indexOf(curr) < 0)
            acc.push(curr);
        return acc;
    }, []);

    let finalchaps = transformed.map(chapter => Object.assign(chapter, {viewpointClass: viewpointclasses[viewpoints.indexOf(chapter.viewpoint)]}));
    return finalchaps;
}