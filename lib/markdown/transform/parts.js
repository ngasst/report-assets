const extractChapters = require('./extract-chapters');

module.exports = (js) => {
    return new Promise((resolve, reject) => {
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
            
        let bookTitle = js.filter((e, i) => i < 1)[0][1][2];
            
        let manuscript = {
            title: bookTitle,
            parts: parts
        }
        resolve(manuscript);
    });
}