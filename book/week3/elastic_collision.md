(w3-elastic-collision)=
# 1D elastic collisions

*Placeholder text — replace with your own explanation.*

In a **head-on elastic collision**, both momentum and kinetic energy are conserved, which fixes
the outgoing velocities uniquely:

$$
v_1' = \frac{m_1 - m_2}{m_1 + m_2} v_1 + \frac{2 m_2}{m_1 + m_2} v_2,
\qquad
v_2' = \frac{2 m_1}{m_1 + m_2} v_1 + \frac{m_2 - m_1}{m_1 + m_2} v_2 .
$$

Equal masses simply *exchange* velocities; a light block bouncing off a very heavy one reverses;
a heavy block barely notices a light one. Try all three below.

```{admonition} Problem
:class: note
Two blocks slide on a frictionless line and collide elastically. Predict the outgoing velocities
for equal masses, and for a light block hitting a heavy one. The readout shows that total
momentum $P$ and kinetic energy $E_\text{kin}$ are unchanged by the collision.
```

```{raw} html
<div class="tb-widget" id="ec">
  <div class="tb-controls">
    <label>Mass <em>m₁</em> (kg): <b><span id="ec-m1val">1.0</span></b>
      <input id="ec-m1" type="range" min="0.5" max="10" step="0.5" value="1"></label>
    <label>Mass <em>m₂</em> (kg): <b><span id="ec-m2val">2.0</span></b>
      <input id="ec-m2" type="range" min="0.5" max="10" step="0.5" value="2"></label>
    <label>Initial <em>v₁</em> (m/s): <b><span id="ec-v1val">4.0</span></b>
      <input id="ec-v1" type="range" min="-6" max="6" step="0.5" value="4"></label>
    <label>Initial <em>v₂</em> (m/s): <b><span id="ec-v2val">0.0</span></b>
      <input id="ec-v2" type="range" min="-6" max="6" step="0.5" value="0"></label>
  </div>
  <div class="tb-buttons">
    <button id="ec-play">▶ Play</button>
    <span class="tb-info" id="ec-info"></span>
  </div>
  <div class="tb-plot" id="ec-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('ec-info'), plot = $('ec-plot'), play = $('ec-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var timer = null, cur = null, XL = 0, XR = 20;

  function halfWidth(m, mref) { return 0.6 * Math.pow(m / mref, 1 / 3); }

  function compute() {
    var m1 = +$('ec-m1').value, m2 = +$('ec-m2').value, v1 = +$('ec-v1').value, v2 = +$('ec-v2').value;
    var mref = Math.min(m1, m2), w1 = halfWidth(m1, mref), w2 = halfWidth(m2, mref);
    var dur = 12, fps = 30, nf = dur * fps, dt = dur / nf;
    var x1 = 5, x2 = 15, cv1 = v1, cv2 = v2;
    var X1 = [], X2 = [], V1 = [], V2 = [];
    for (var i = 0; i <= nf; i++) {
      X1.push(x1); X2.push(x2); V1.push(cv1); V2.push(cv2);
      // advance one frame with a single exact collision resolve
      var nx1 = x1 + cv1 * dt, nx2 = x2 + cv2 * dt;
      var gapNow = (x2 - w2) - (x1 + w1), gapNew = (nx2 - w2) - (nx1 + w1);
      if (gapNow >= 0 && gapNew < 0 && cv1 > cv2) {
        var tc = gapNow / ((cv1 - cv2)); if (tc < 0) tc = 0; if (tc > dt) tc = dt;
        x1 += cv1 * tc; x2 += cv2 * tc;
        var s = m1 + m2;
        var p1 = (m1 - m2) / s * cv1 + 2 * m2 / s * cv2;
        var p2 = 2 * m1 / s * cv1 + (m2 - m1) / s * cv2;
        cv1 = p1; cv2 = p2;
        var rem = dt - tc; x1 += cv1 * rem; x2 += cv2 * rem;
      } else { x1 = nx1; x2 = nx2; }
    }
    var P = m1 * v1 + m2 * v2, K = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
    return { m1:m1, m2:m2, w1:w1, w2:w2, X1:X1, X2:X2, V1:V1, V2:V2, nf:nf, P:P, K:K };
  }

  function rect(cx, w) {
    return [[cx - w, cx + w, cx + w, cx - w, cx - w], [0, 0, 2 * w, 2 * w, 0]];
  }

  function draw(i) {
    var d = compute(); cur = d;
    var r1 = rect(d.X1[i], d.w1), r2 = rect(d.X2[i], d.w2), hmax = 2 * Math.max(d.w1, d.w2);
    var data = [
      { x:[XL, XR], y:[0, 0], mode:'lines', line:{color:'#888', width:2}, hoverinfo:'skip' },
      { x:r1[0], y:r1[1], mode:'lines', fill:'toself', name:'m₁', line:{color:'#2e6be4', width:2}, fillcolor:'rgba(46,107,228,0.35)' },
      { x:r2[0], y:r2[1], mode:'lines', fill:'toself', name:'m₂', line:{color:'#2ea44f', width:2}, fillcolor:'rgba(46,164,79,0.35)' }
    ];
    var layout = {
      margin:{l:15, r:15, t:10, b:20}, showlegend:false,
      xaxis:{range:[XL - 1, XR + 1], zeroline:false, showticklabels:false, gridcolor:'rgba(128,128,128,0.15)'},
      yaxis:{range:[-0.5, hmax + 1], zeroline:false, showticklabels:false,
             scaleanchor:'x', scaleratio:1, gridcolor:'rgba(128,128,128,0.15)'},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'}
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    setInfo(d, i);
  }

  function setInfo(d, i) {
    info.innerHTML = "v₁: <b>" + d.V1[i].toFixed(2) + " m/s</b> · v₂: <b>" + d.V2[i].toFixed(2) +
      " m/s</b> · P: <b>" + d.P.toFixed(2) + " kg·m/s</b> · E_kin: <b>" + d.K.toFixed(2) + " J</b>";
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Play'; }
  function refresh() {
    stop();
    $('ec-m1val').textContent = (+$('ec-m1').value).toFixed(1);
    $('ec-m2val').textContent = (+$('ec-m2').value).toFixed(1);
    $('ec-v1val').textContent = (+$('ec-v1').value).toFixed(1);
    $('ec-v2val').textContent = (+$('ec-v2').value).toFixed(1);
    draw(0);
  }
  ['ec-m1','ec-m2','ec-v1','ec-v2'].forEach(function (id) { $(id).addEventListener('input', refresh); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    var i = 0; play.textContent = '⏸ Pause';
    timer = setInterval(function () {
      var r1 = rect(cur.X1[i], cur.w1), r2 = rect(cur.X2[i], cur.w2);
      Plotly.restyle(plot, { x:[r1[0], r2[0]], y:[r1[1], r2[1]] }, [1, 2]);
      setInfo(cur, i);
      i++; if (i > cur.nf) i = 0;   // loop
    }, 1000 / 30);
  });
  refresh();
});
</script>
```
