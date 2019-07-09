// eslint-disable-next-line import/prefer-default-export
export function isIOSSafari() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}
