console.log('Listening to custom function');

window.addEventListener('message', function(event) {
  console.log(event);

  if (event.source !== window) return;
  if (event.data.type === '@wt') {
    console.log(event.data);
    if (event.data.func) {
      eval(event.data.func);
      if (window.__wtFn__) window.__wtFn__();
    }
  }
});
