// HOSTNAME & PORT kommen aus webpack.DefinePlugin
// und werden im Buildprozess gesetzt
// eslint-disable-next-line no-undef
const BASE_URL = `${HOSTNAME}${PORT ? ':' : ''}${PORT}`;

export default BASE_URL;
