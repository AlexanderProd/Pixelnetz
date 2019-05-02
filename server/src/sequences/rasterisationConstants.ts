// eslint-disable-next-line import/no-mutable-exports
export let RESOLUTION = process.env.RASTERIZATION_RESOLUTION || 100;
// eslint-disable-next-line import/no-mutable-exports
export let MAX_FRAMES = process.env.RASTERIZATION_MAX_FRAMES || 50;

export function setConstant(
  c: 'RESOLUTION' | 'MAX_FRAMES',
  val: number,
) {
  if (c === 'RESOLUTION') {
    RESOLUTION = val;
  } else if (c === 'MAX_FRAMES') {
    MAX_FRAMES = val;
  }
}
