/*
 * tb_plotly.js — shared Plotly loader for TeachBooks interactive widgets.
 *
 * The book loads require.js (for live-code / thebe), which puts the page in AMD
 * mode. Plotly's UMD bundle then registers as an anonymous AMD module instead of
 * setting the window.Plotly global. This helper loads the vendored bundle
 * (book/_static/plotly-basic.min.js) and, if AMD is active, temporarily switches
 * it off just while Plotly executes so it takes the global path, then restores it
 * (require.js / live-code keeps working). Usage:
 *
 *     tbLoadPlotly(function (Plotly) {
 *         if (!Plotly) { ...show an error...; return; }
 *         ...build the widget...
 *     });
 */
(function () {
  var loaded = null, loading = false, queue = [];

  function staticBase() {
    // Derive the _static/ URL from any theme script; some live in _static/scripts/,
    // so cut at "_static/" rather than stripping only the last path segment.
    var probe = document.querySelector('script[src*="_static/"]');
    return probe ? probe.src.replace(/_static\/.*$/, '_static/') : '_static/';
  }

  function finish(P) {
    loaded = P; loading = false;
    var q = queue; queue = [];
    q.forEach(function (cb) { cb(P); });
  }

  function inject(suppressAmd) {
    var d = window.define, hadAmd;
    if (suppressAmd && d) { hadAmd = d.amd; d.amd = false; }
    var s = document.createElement('script');
    s.src = staticBase() + 'plotly-basic.min.js';
    s.onload = function () { if (suppressAmd && d) d.amd = hadAmd; finish(window.Plotly || null); };
    s.onerror = function () { if (suppressAmd && d) d.amd = hadAmd; finish(null); };
    document.head.appendChild(s);
  }

  window.tbLoadPlotly = function (cb) {
    if (window.Plotly) { cb(window.Plotly); return; }
    if (loaded) { cb(loaded); return; }
    queue.push(cb);
    if (loading) return;
    loading = true;
    var tries = 0;
    (function ready() {
      if (window.Plotly) { finish(window.Plotly); }
      else if (window.define && window.define.amd) { inject(true); }   // AMD on → suppress it
      else if (tries++ < 400) { setTimeout(ready, 25); }               // wait for require.js
      else { inject(false); }                                          // AMD never appeared
    })();
  };
})();
