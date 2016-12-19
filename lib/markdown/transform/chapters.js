const extractChapters = require('./extract-chapters');

module.exports = (js) => {
    return new Promise((resolve, reject) => {
        let chapters = extractChapters(js);
        let bookTitle = js.filter((e, i) => i < 1)[0].filter((h, i) => i < 1)[0][2];
            
        let manuscript = {
            title: bookTitle,
            chapters: chapters
        }
        
        resolve(manuscript);
    });
}