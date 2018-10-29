const baseUrl = () => {
  const local = document.location.hostname === 'localhost';
  const base = local ? 'http://localhost:3000' : '';
  return base;
};

export default baseUrl;
