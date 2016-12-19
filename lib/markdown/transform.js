const outlineOnlyChapters = require('./transform/chapters');
const outlineWithParts = require('./transform/parts');

module.exports = transform = (js, hasparts) => {
    
    return new Promise((resolve, reject) => {
        if (hasparts) {
            outlineWithParts(js)
                .then(outline => resolve(outline))
                .catch(err => reject(err));
        } else {
            outlineOnlyChapters(js)
                .then(outline => resolve(outline))
                .catch(err => reject(err));
        }
    });
}