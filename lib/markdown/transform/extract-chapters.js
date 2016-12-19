

module.exports = chapters = (js) => {
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