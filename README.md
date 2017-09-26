# Subresource Integrity Fallback [sri.js.org](https://sri.js.org)

## What is Subresource Integrity

[Subresource Integrity (SRI)][1] is a security feature that ensures that resources client browser downloads and runs (JavaScript/CSS) haven't been tampered with.

[SRI Browser support][2] is on the rise and some CDNs include it in the best practices. All is sunsh[i][3]ne and lollipops until you see this error in user's console:

![Failed Subresource Integrity check in Chrome][4]Failed Subresource Integrity check in Chrome

Guess what, nothing works. Nobody knows why. Rogue proxy? Optimalization proxy? Maybe your CDN is hacked or lying to you. Anyway, your resources are broken.

## Fallback

If we don't want to leave user with an application in nonfunctioning state or at least provide the user some feedback on why application couldn't start, we need a fallback. So how can we handle tampered resource?

### Strategy

Script is downloaded, but before its execution, SRI hash is checked against the downloaded resource. If hash check fails, [error event is fired][5] and resource is not executed. This error is not propagated to the `window.onerror` and _afaik_ can't be distinguished from other errors. So we need to catch all of them.

To catch `script/link` errors, we can use [`onerror][6]` handler. But we need to hook it right as the resource is added to the DOM. For that we can use [MutationObserver][7].

### Fallback flow

1. Monitor DOM for a new `script/link` elements with `integrity` attribute
2. Add `onerror` handler to those
3. If `onerror` is fired, try to load fallback resource specified on the element
4. When downloading fallback resource fails (or fallback is not available) script fires an event to notify user that something went wrong

## How to use

Because we are trying to deal with unreliable CDN/network, **all of the following code must be placed in the document itself** and shouldn't be served from any remote location.

### 1) Add [SRI fallback code][8] to the header

Code must be placed before any resource using `integrity` attribute - ideally in `<head>`, since CSS `link` can also utilize integrity check. Its minified version _(~0,4kb gzipped)_ is also on [`npm][9]`:

**`npm i subresource-integrity-fallback -S`**

### 2) Add resource fallback data attributes

Then you need to supply `data-sri-fallback` attribute on any resource with `integrity` check. Example use:
    
```html    
<script
src="https://cdn.example.com/app.js"
data-sri-fallback="https://example.com/app.js"
integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
crossorigin="anonymous"></script>
```

It might be a good idea to either serve fallback resources from same server that serves the actual page or setup a secondary CDN as a fallback.

### 3) Define a behavior on failure

Last missing piece is the `window.resourceLoadError` function, that will be called when resource with `integrity` check fails to load - as explained above, this reason can come either from normal network problems or resource tampering. Function will get error itself as an argument and boolean indicating whether fallback resource also failed. Function will be called for each failing resource.
    
```js
// In the 
window.resourceLoadError = function(err, isRetry) {
  if (isRetry) {
    return letUserKnowAboutPossibleTampering(err);
  }
  return letUserKnowSomethingFailedToLoad(err);
}
// SRI Fallback code below this...
```

## Other considerations

* Have a reason to use it. SRI is not a free lunch, be sure you need it and are ready to spend some resources on it.
* You should [send `no-transform` header][10] from your CDN.
* Using this together with [CSP][11] is a good idea.

## Big thanks to

## Made by [JM][12]

[1]: https://mdn.io/SubresourceIntegrity
[2]: http://caniuse.com/#feat=subresource-integrity
[3]: https://www.youtube.com/watch?v=XQmBXEZEYtg
[4]: https://sri.js.org/sri-issue-chrome.jpg
[5]: https://www.w3.org/TR/SRI/#handling-integrity-violations
[6]: https://developer.mozilla.org/cs/docs/Web/API/GlobalEventHandlers/onerror
[7]: https://developer.mozilla.org/docs/Web/API/MutationObserver
[8]: https://github.com/JackuB/subresource-integrity-fallback/tree/master/dist
[9]: https://www.npmjs.com/package/subresource-integrity-fallback
[10]: https://www.w3.org/TR/SRI/#proxies
[11]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
[12]: http://mikul.as

  
