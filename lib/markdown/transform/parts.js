const extractChapters = require('./extract-chapters');
const util = require('util');
const fs = require('fs-extra');
const path = require('path');

module.exports = (js) => {
    return new Promise((resolve, reject) => {
        let partsarr = js.map(arr => arr.filter((e, i) => i > 0));
        
        let parts = partsarr.map((part, i) => {
             if (i === 0)
                part = part.filter((e, i) => i > 0);
            let quo;
            if (part[1][2].toLowerCase().includes('quot')) {
                if (part[2][0] === 'blockquote') {
                    quo = part[2][1][1][1];
                } else {
                    quo = '';
                }
            } else {
                quo = '';
            }

            let title = part[0][2];

            if (part[1][2].toLowerCase().includes('quote')) {
                if (part[2][0] === 'blockquote') {
                    chaps = part.slice(3);
                } else {
                    chaps = part.slice(2);
                }
            } else {
                chaps = part.slice(1);
            }
            return {
                quote: quo,
                title: title,
                chapters: extractChapters(chaps)
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

function objectify(arr) {
    return Object.assign({}, {[arr[0]]: arr.slice(1)});
}