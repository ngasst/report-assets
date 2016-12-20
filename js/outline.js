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
        }
    } 
});