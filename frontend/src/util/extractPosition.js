const extractPosition = (query = window.location.search) => query
  .substring(1)
  .split('&')
  .map(x => x.split('='))
  .reduce((acc, [key, val]) => ({
    ...acc,
    [key]: val,
  }), {});

export default extractPosition;
