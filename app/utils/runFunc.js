/*
  LEGACY:
  Call methods on the webpage within the extension scope
*/

export default function runFunc(fn) {
  window.postMessage({
    type: '@wt',
    func: typeof fn === 'function' ? 'window.__wtFn__ = ' + fn.toString()
    : fn,
  },
    '*'
  );
}
