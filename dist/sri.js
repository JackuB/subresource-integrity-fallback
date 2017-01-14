try {(function() {
// Function called on failure:
// - `Error` as first argument
// - `bool` whether it was a fallback failure
var loadErrCb = window.resourceLoadError || function() {};

// Internal way to recognize fallback loads
var retryAttr = 'data-sri-fallback-retry';

// HTML attribute used to describe fallback URL
var fbAttr = 'data-sri-fallback';

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
// Browsers without MO won't support SRI
if(MutationObserver) {
  new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) { mutation.addedNodes.forEach(processNode); });
  }).observe(document, { childList: true, subtree: true });
}

var processNode = function(node) {
  var tagName = (node.tagName || '').toLowerCase();
  var tagAttribute = null;
  if (
    (
      (tagName === 'link' && node.href && (tagAttribute = 'href'))
      || (tagName === 'script' && node.src && (tagAttribute = 'src'))
    ) && node.integrity && !node.getAttribute(retryAttr)
  ) {
    node.onerror = function(e) {
      if (node.getAttribute(fbAttr)) {
        var fb = document.createElement(node.tagName);
        fb.integrity = node.integrity;
        fb.crossOrigin = node.crossOrigin;
        fb.rel = node.rel;
        fb.setAttribute(retryAttr, '1');
        fb.type = node.type;
        fb[tagAttribute] = node.getAttribute(fbAttr);
        fb.onerror = function(e) {
          loadErrCb(e, true);
        };
        document.head.appendChild(fb);
      } else {
        loadErrCb(e, false);
      }
    };
  }
};
})();} catch(e) {console.error(e)};
