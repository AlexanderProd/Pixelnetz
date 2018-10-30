const serverTime = (message) => {
  const { serverTime } = message;
  const localTime = Date.now();
  console.log(`${localTime - serverTime} milliseconds behind server.`);
};

export default serverTime;
