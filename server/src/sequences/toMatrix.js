const toMatrix = (arr, sliceLength) => arr.reduce((acc, item) => {
  const last = acc.pop() || [];
  return last.length < sliceLength
    ? [...acc, [...last, item]]
    : [...acc, last, [item]];
}, []);

export default toMatrix;
