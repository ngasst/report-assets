const fs = require('fs-extra');
const path = require('path');
const util = require('util');

module.exports = chapters = (js) => {
    let chaparrs = [];

    
    fs.writeFileSync(path.resolve('./output.json'), util.inspect(js, false, 7));

    let title = markup[0][2];
    let sum = markup[2][0] === 'para' ? markup[2][1] : 'None.';
    let summary = sum.split(/\r|\n/).map(p => `<p>${p}</p>`).join('');
    let points = typeof markup[markup.indexOf('bulletlist')] === 'undefined' ? [] : markup[markup.indexOf('bulletlist')];
    let chap = {
        title: title,
        summary: summary,
        points: points
    }


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