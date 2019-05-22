import banner from './banner';

function createLogMessage(
  localHostname: string,
  port: number,
): string {
  const url = `http://${localHostname}:${port}`;
  const message = `
${banner}
Client Seite auf ${url} aufrufen.
Steuerung der Animation unter ${url}/master.
  `;
  return message;
}

export default createLogMessage;
