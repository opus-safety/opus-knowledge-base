/**
 * Dark-mode lock — standalone, decoupled from any background animation.
 *
 * Usage: set `force-dark: true` in a page's front matter (main.html then
 * includes this script) and put a `data-force-dark` attribute on an element
 * in the page body (e.g. the hero wrapper). The attribute is what survives
 * instant navigation: this script stays alive across SPA page swaps, so it
 * re-checks the DOM on every navigation to decide whether the lock applies.
 *
 * While locked: the colour scheme is forced to "slate" and the palette
 * toggle is hidden (body.dark-lock, see neural-hero.css). The visitor's own
 * scheme choice is restored on navigation away — localStorage is untouched.
 */

(function () {
  if (window.__darkLock) return;
  window.__darkLock = true;

  var savedScheme = null;

  function wantsLock() {
    return document.querySelector('[data-force-dark]') !== null;
  }

  function lock() {
    if (savedScheme === null) {
      savedScheme = document.body.getAttribute('data-md-color-scheme') || 'default';
    }
    document.body.classList.add('dark-lock');
    document.body.setAttribute('data-md-color-scheme', 'slate');
  }

  function unlock() {
    document.body.classList.remove('dark-lock');
    if (savedScheme !== null) {
      document.body.setAttribute('data-md-color-scheme', savedScheme);
      savedScheme = null;
    }
  }

  function update() {
    if (wantsLock()) { lock(); } else { unlock(); }
  }

  /* Navigation hooks (instant navigation keeps scripts alive) */
  window.addEventListener('popstate', update);

  var _push = history.pushState.bind(history);
  history.pushState = function () {
    _push.apply(history, arguments);
    update();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', update);
  } else {
    update();
  }
})();
