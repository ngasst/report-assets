const app = new Vue({
    el: '#app',
    data: {
        outline: data
    },
    methods: {
        displayWordCount: (number) => {
            return `${number.toLocaleString('fr-BE', {minimumFractionDigits: 0})} words`;
        },
        getTopFiveOccurences: (occurence) => {
            let occurences = occurence;
            occurences.sort((a, b) => {
                if (a.value > b.value)
                    return -1;
                if (a.value < b.value)
                    return 1;
                return 0;
            });
            
            return occurences.filter((v, i) => i < 5);
        },
        displaySummary(summary) {
            let regex = /\n|\r/g;
            (summary === null || typeof summary === 'undefined') ? summary = ''.concat(`\r\n`) : summary = summary;
            summary = summary.match(regex) === null || typeof summary !== 'string' ? summary.concat(`no summary found\r\nplease create one\rthank you\n`) : summary = summary;
            let paragraphs = summary.split(regex);
            return paragraphs.map(p => `<p>${p}</p>`).join('');
        }
    } 
});