function isInjected(tabId, cb) {
  return chrome.tabs.executeScript(tabId, {
    code: `var injected = window.reactExampleInjected;
      window.reactExampleInjected = true;
      injected;`,
    runAt: 'document_start'
  }, cb);
}

function loadScript(name, tabId, cb) {
  // let injectEvalPath;

  if (process.env.NODE_ENV === 'production') {
    // console.log('production??');
    // injectEvalPath = chrome.extension.getURL('/js/injectEval.bundle.js');
    // [TODO] inject using chrome-extension path
    chrome.tabs.executeScript(tabId, { file: `/js/${name}.bundle.js`, runAt: 'document_end' }, cb);
  } else {
    // dev: async fetch bundle
    /*
    fetch(`http://localhost:3000/js/${name}.bundle.js`)
    .then(res => res.text())
    .then(fetchRes => {
      // Load redux-devtools-extension inject bundle,
      // because inject script and page is in a different context
      const request = new XMLHttpRequest();
      request.open('GET', 'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/inject.bundle.js');  // sync
      request.send();
      request.onload = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
          chrome.tabs.executeScript(tabId, { code: request.responseText, runAt: 'document_start' });
        }
      };
      chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, cb);
    });
    */
    const request = new XMLHttpRequest();
    request.open('GET', 'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/inject.bundle.js');  // sync
    request.send();
    request.onload = () => {
      if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        chrome.tabs.executeScript(tabId, { code: request.responseText, runAt: 'document_start' });
      }
    };

    const bilibiliPlayer = chrome.extension.getURL('/bilibiliPlayer.min.js');
    chrome.tabs.executeScript(tabId, {
      code: `var th = document.getElementsByTagName('body')[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    // debug only
    s.setAttribute('src', '${bilibiliPlayer}');
    th.appendChild(s);
  `,
      runAt: 'document_end'
    });

    chrome.tabs.executeScript(tabId, {
      code: `var th = document.getElementsByTagName('body')[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    // debug only
    s.setAttribute('src', 'http://localhost:3000/js/${name}.bundle.js');
    th.appendChild(s);
  `,
      runAt: 'document_end'
    });
    // injectEvalPath = 'http://localhost:3000/js/injectEval.bundle.js';
  }
  /*
  chrome.tabs.executeScript(tabId, {
    code: `var th = document.getElementsByTagName('body')[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  // debug only
  s.setAttribute('src', '${injectEvalPath}');
  th.appendChild(s);
`,
    runAt: 'document_end'
  });
  */
}

const arrowURLs = /^http?:\/\/.*bilibili\.com.*/;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // console.log(tab);
  if (changeInfo.status !== 'loading' || !tab.url.match(arrowURLs)) return;

  isInjected(tabId, (result) => {
    if (chrome.runtime.lastError || result[0]) return;
    loadScript('inject', tabId, () => console.log('load inject bundle success!'));
  });
});
