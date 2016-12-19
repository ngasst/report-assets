module.exports = flatten = (arr) => {
    return arr.reduce((explored, toexplore) => {
        return explored.concat((Array.isArray(toexplore)) ? flatten(toexplore) : toexplore);
    }, []);
}