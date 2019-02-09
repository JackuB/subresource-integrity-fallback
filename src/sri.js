try {(function() {
// Function called on failure:
// - `Error` as first argument
// - `bool` whether it was a fallback failure
const loadErrCb = window.resourceLoadError || (() => {});

// Internal way to recognize fallback loads
const retryAttr = 'data-sri-fallback-retry';

// HTML attribute used to describe fallback URL
const fbAttr = 'data-sri-fallback';

const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
// Browsers without MO won't support SRI
if(MutationObserver) {
  new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(processNode);
    });
  }).observe(document, { childList: true, subtree: true });
}

const processNode = function(node) {
  const tagName = (node.tagName || '').toLowerCase();
  if (
    (tagName === 'link' || tagName === 'script')
    && node.integrity
    && !node.getAttribute(retryAttr)
  ) {
    node.onerror = function(e) {
      if (node.getAttribute(fbAttr)) {
        const fb = document.createElement(tagName);
        const parent = node.parentNode;

        fb.setAttribute(retryAttr, '1');
        fb.setAttribute('integrity', node.integrity);

        if (node.src) fb.setAttribute('src', node.getAttribute(fbAttr));
        if (node.href) fb.setAttribute('href', node.getAttribute(fbAttr));

        fb.onerror = function(e) {
          loadErrCb(e, true);
        };

        parent.appendChild(fb);
        node.remove();
      } else {
        loadErrCb(e, false);
      }
    };
  }
};
})();} catch(e) {console.error(e)};
