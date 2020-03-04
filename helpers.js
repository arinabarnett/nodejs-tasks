exports.getRandomUniqueNumbers = (maxValue, n) => {
  let arr = [];
  while (arr.length < n) {
    let r = Math.floor(Math.random() * maxValue);
    if (arr.indexOf(r) === -1) {
      arr.push(r);
    }
    // The first element of returned array can't be a 0
    if (arr[0] === 0) {
      arr.splice(0, 1);
    }
  }
  return arr;
};
