(w1-killer-loop)=
# Killer loop

*Placeholder text — replace with your own explanation.*

A body released from rest at height $h$ slides down a frictionless ramp and around a vertical
circular loop of radius $R$. With no friction its speed at any height $z$ follows from energy
conservation,

$$
\tfrac{1}{2} m v^2 = m g (h - z) \quad\Longrightarrow\quad v = \sqrt{2g(h-z)} .
$$

To keep contact at the **top** of the loop ($z = 2R$) the centripetal requirement gives the
classic condition $h \ge \tfrac{5}{2}R$.

```{admonition} Problem
:class: note
A body starts from rest at point $A$ (height $h$) on a frictionless looping track of radius
$R$. Find the velocity at the top ($B$) and bottom ($C$) of the loop, and the maximum ratio
$R/h$ for which the body still completes the loop. Explore with $h = 20$, $R = 10$.
```

```{raw} html
<div class="tb-widget" id="kl">
  <div class="tb-controls">
    <label>Release height <em>h</em> (m): <b><span id="kl-hval">20</span></b>
      <input id="kl-h" type="range" min="15" max="30" step="0.5" value="20"></label>
    <label>Loop radius <em>R</em> (m): <b><span id="kl-rval">10</span></b>
      <input id="kl-r" type="range" min="5" max="20" step="0.5" value="10"></label>
  </div>
  <div class="tb-buttons">
    <button id="kl-play">▶ Play</button>
    <span class="tb-info" id="kl-info"></span>
  </div>
  <div class="tb-plot" id="kl-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('kl-info'), plot = $('kl-plot'), play = $('kl-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var g = 9.8, m = 1.0, C = 30, timer = null, cur = null;

  function tangent(ox, oy, hx, hy, R) {
    var a = hx - ox, b = hy - oy, dsq = a * a + b * b;
    if (dsq <= R * R) return null;
    var dr = Math.sqrt(dsq - R * R), f1 = R * R / dsq, f2 = R * dr / dsq;
    var p1 = [ox + f1 * a - f2 * b, oy + f1 * b + f2 * a];
    var p2 = [ox + f1 * a + f2 * b, oy + f1 * b - f2 * a];
    if (p1[0] < ox && p1[1] < oy) return p1;
    if (p2[0] < ox && p2[1] < oy) return p2;
    return null;
  }

  function compute() {
    var h = +$('kl-h').value, R = +$('kl-r').value;
    var pt = tangent(C, R, 0, h, R) || [0, 0];
    var px = pt[0], py = pt[1];
    var L = Math.sqrt(px * px + (h - py) * (h - py));
    var sinB = (h - py) / L, aLine = g * sinB, tLine = Math.sqrt(2 * L / aLine);
    var dur = Math.min(20, Math.max(8, tLine * 3)), fps = 30;
    var nf = Math.round(dur * fps), dt = dur / nf;
    var phi = Math.atan2(py - R, px - C), finished = false, sx = 0, sy = 0;
    var X = [], Y = [], V = [], KE = [], PE = [];
    for (var i = 0; i <= nf; i++) {
      var ti = i * dt, x, y, v;
      if (finished) { x = sx; y = sy; v = 0; }
      else if (ti <= tLine) {
        var s = 0.5 * aLine * ti * ti;
        x = s * (px / L); y = h - s * sinB; v = aLine * ti;
      } else {
        var yc = R + R * Math.sin(phi);
        var vc = Math.sqrt(Math.max(2 * g * (h - yc), 0));
        phi += (vc / R) * dt;
        x = C + R * Math.cos(phi); y = R + R * Math.sin(phi);
        v = Math.sqrt(Math.max(2 * g * (h - y), 0));
        if (y >= h) { finished = true; sx = x; sy = y; }
      }
      X.push(x); Y.push(y); V.push(v);
      KE.push(0.5 * m * v * v); PE.push(m * g * y);
    }
    return { h:h, R:R, px:px, py:py, X:X, Y:Y, V:V, KE:KE, PE:PE, nf:nf };
  }

  function draw(idx) {
    var d = compute(); cur = d;
    var i = idx == null ? 0 : idx;
    var xhi = C + d.R + 6, yhi = Math.max(d.h, 2 * d.R) + 6;
    var data = [
      { x:[0, d.px], y:[d.h, d.py], mode:'lines', name:'Ramp', line:{color:'#888', width:3} },
      { x:[d.X[i]], y:[d.Y[i]], mode:'markers', name:'Body',
        marker:{color:'#e4572e', size:15, line:{color:'#000', width:1}} }
    ];
    var layout = {
      margin:{l:20, r:15, t:10, b:20}, showlegend:false,
      xaxis:{range:[-6, xhi], zeroline:false, showticklabels:false, gridcolor:'rgba(128,128,128,0.15)'},
      yaxis:{range:[-6, yhi], zeroline:false, showticklabels:false,
             scaleanchor:'x', scaleratio:1, gridcolor:'rgba(128,128,128,0.15)'},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'},
      shapes:[
        { type:'circle', x0:C - d.R, y0:0, x1:C + d.R, y1:2 * d.R, line:{color:'#888', width:3} },
        { type:'line', x0:C, y0:0, x1:C, y1:d.R, line:{color:'#bbb', width:1, dash:'dot'} }
      ],
      annotations:[
        { x:0, y:d.h, ax:-12, ay:0, text:'A', showarrow:false, font:{size:15} },
        { x:C, y:2 * d.R, ax:0, ay:-12, text:'B', showarrow:false, font:{size:15} },
        { x:C, y:0, ax:0, ay:14, text:'C', showarrow:false, font:{size:15} },
        { x:C + d.R * 0.55, y:d.R * 0.5, showarrow:false, text:'R = ' + d.R, font:{size:12} }
      ]
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    setInfo(i, d);
  }

  function setInfo(i, d) {
    info.innerHTML = 'v: <b>' + d.V[i].toFixed(2) + ' m/s</b> · height: <b>' + d.Y[i].toFixed(1) +
      ' m</b> · KE: <b>' + d.KE[i].toFixed(1) + ' J</b> · PE: <b>' + d.PE[i].toFixed(1) +
      ' J</b> · E: <b>' + (d.KE[i] + d.PE[i]).toFixed(1) + ' J</b>';
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Play'; }
  function refresh() {
    stop();
    $('kl-hval').textContent = $('kl-h').value;
    $('kl-rval').textContent = $('kl-r').value;
    draw(null);
  }
  ['kl-h','kl-r'].forEach(function (id) { $(id).addEventListener('input', refresh); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    var i = 0; play.textContent = '⏸ Pause';
    timer = setInterval(function () {
      Plotly.restyle(plot, { x:[[cur.X[i]]], y:[[cur.Y[i]]] }, [1]);
      setInfo(i, cur);
      if (i++ >= cur.nf) stop();
    }, 1000 / 30);
  });
  refresh();
});
</script>
```
