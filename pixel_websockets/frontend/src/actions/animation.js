const on = () => document.body.style = 'background: white;';
const off = () => document.body.style = 'background: black;';

const animation = (message) => {
  if (message.on) on();
  else off();
};

export default animation;
