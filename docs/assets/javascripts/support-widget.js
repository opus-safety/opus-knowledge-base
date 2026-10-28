// Support widget — vendor-neutral shim over the live help-desk widget.
//
// Pages never call the vendor API directly. Every "contact us" link/button in
// the KB (and the ones the more-buttons extension emits) calls
//   window.supportWidget.open()   (or .toggle() / .close())
// so swapping help-desk provider is a change to this file only.
//
// Current provider: Help Scout Beacon.

// ── Help Scout Beacon loader (verbatim embed snippet) ────────────────────────
!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});

// No floating launcher bubble: the widget only opens from links/buttons.
// (Also set to "hidden" in the Help Scout dashboard; this makes it explicit.)
window.Beacon('config', { display: { style: 'manual' } });
window.Beacon('init', '9eb5b2bd-8c01-43c9-a5f7-a0846e9f5e14');

// ── Vendor-neutral API used by page content ──────────────────────────────────
window.supportWidget = {
  open:   function () { window.Beacon('open'); },
  close:  function () { window.Beacon('close'); },
  toggle: function () { window.Beacon('toggle'); }
};

// ── Backdrop overlay while the panel is open ─────────────────────────────────
// The panel itself is centred by assets/stylesheets/support-widget.css; on
// phones Beacon goes full-screen (it adds .is-mobile from the user agent), so
// the blurred backdrop is skipped there (it would sit behind the panel anyway).
var supportOverlay = document.createElement('div');
supportOverlay.className = 'support-widget-overlay';
supportOverlay.addEventListener('click', function () { window.supportWidget.close(); });
document.addEventListener('DOMContentLoaded', function () {
  document.body.appendChild(supportOverlay);
});

function setSupportOverlay(isOpen) {
  var mobile = !!document.querySelector('#beacon-container .BeaconContainer.is-mobile');
  supportOverlay.classList.toggle('is-open', isOpen && !mobile);
}
window.Beacon('on', 'open',  function () { setSupportOverlay(true); });
window.Beacon('on', 'close', function () { setSupportOverlay(false); });

// ── Deep link: ?open-support-form=true opens the widget on load ──────────────
if (new URLSearchParams(window.location.search).get('open-support-form') === 'true') {
  window.supportWidget.open();
}
