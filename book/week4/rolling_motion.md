(w4-rolling-motion)=
# Rolling motion down a slope

*Placeholder text — replace with your own explanation.*

A body rolling without slipping down an incline of angle $\alpha$ has to share its energy
between translation and rotation, so it accelerates more slowly than a frictionless slider:

$$
a = \frac{g\sin\alpha}{1 + I/mr^2} .
$$

The factor $I/mr^2$ is $\tfrac12$ for a solid cylinder, $1$ for a hoop (hollow cylinder) and
$\tfrac25$ for a solid sphere — so the **sphere wins**, the solid cylinder is next, and the hoop
comes last, *regardless of mass and radius*.

```{admonition} Problem
:class: note
A solid cylinder, a hollow cylinder and a solid sphere are released together from the top of a
$25^\circ$ incline. Predict the order in which they reach the bottom and the ratio of their
accelerations. Then race them below.
```

```{raw} html
<div class="tb-widget" id="rm">
  <div class="tb-controls">
    <label>Slope angle <em>α</em> (°): <b><span id="rm-aval">25</span></b>
      <input id="rm-a" type="range" min="5" max="40" step="1" value="25"></label>
    <label>Slope length (m): <b><span id="rm-lval">20</span></b>
      <input id="rm-l" type="range" min="8" max="30" step="1" value="20"></label>
  </div>
  <div class="tb-buttons">
    <button id="rm-play">▶ Race</button>
    <span class="tb-info" id="rm-info"></span>
  </div>
  <div class="tb-plot" id="rm-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('rm-info'), plot = $('rm-plot'), play = $('rm-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var g = 9.81, r = 0.6, timer = null, tSim = 0, cur = null;
  var names = ['Solid cylinder', 'Hollow cylinder', 'Solid sphere'];
  var bfac = [1.5, 2.0, 1.4];                 // 1 + I/mr^2
  var cols = ['#2e6be4', '#e8832a', '#2ea44f'];
  var unit = []; for (var k = 0; k <= 40; k++) { var th = 2 * Math.PI * k / 40; unit.push([Math.cos(th), Math.sin(th)]); }

  function model() {
    var alpha = (+$('rm-a').value) * Math.PI / 180, Ls = +$('rm-l').value;
    var u = [Math.cos(alpha), -Math.sin(alpha)], n = [Math.sin(alpha), Math.cos(alpha)];
    var acc = bfac.map(function (b) { return g * Math.sin(alpha) / b; });
    var tfin = acc.map(function (a) { return Math.sqrt(2 * Ls / a); });
    var lane = [0, 1.7 * r, 3.4 * r];
    return { alpha:alpha, Ls:Ls, u:u, n:n, acc:acc, tfin:tfin, lane:lane, tEnd:1.05 * Math.max.apply(null, tfin) };
  }

  function bodyTraces(m, i, t) {
    var s = Math.min(0.5 * m.acc[i] * t * t, m.Ls);
    var cx = s * m.u[0] + (r + m.lane[i]) * m.n[0], cy = s * m.u[1] + (r + m.lane[i]) * m.n[1];
    var cir = [[], []]; for (var k = 0; k < unit.length; k++) { cir[0].push(cx + r * unit[k][0]); cir[1].push(cy + r * unit[k][1]); }
    var phi = -s / r, dir = [Math.cos(phi) * m.n[0] + Math.sin(phi) * m.u[0], Math.cos(phi) * m.n[1] + Math.sin(phi) * m.u[1]];
    var spoke = [[cx, cx + r * dir[0]], [cy, cy + r * dir[1]]];
    return { cx:cx, cy:cy, cir:cir, spoke:spoke };
  }

  function dynData(m, t) {
    var b = [0, 1, 2].map(function (i) { return bodyTraces(m, i, t); });
    var hole = [[], []]; for (var k = 0; k < unit.length; k++) { hole[0].push(b[1].cx + 0.55 * r * unit[k][0]); hole[1].push(b[1].cy + 0.55 * r * unit[k][1]); }
    return { b:b, hole:hole };
  }

  function draw(t) {
    var m = model(); cur = m;
    var d = dynData(m, t);
    var data = [
      { x:d.b[0].cir[0], y:d.b[0].cir[1], mode:'lines', name:names[0], line:{color:cols[0], width:2.5} },
      { x:d.b[1].cir[0], y:d.b[1].cir[1], mode:'lines', name:names[1], line:{color:cols[1], width:2.5} },
      { x:d.b[2].cir[0], y:d.b[2].cir[1], mode:'lines', name:names[2], line:{color:cols[2], width:2.5} },
      { x:d.hole[0], y:d.hole[1], mode:'lines', showlegend:false, line:{color:cols[1], width:1.5} },
      { x:d.b[0].spoke[0], y:d.b[0].spoke[1], mode:'lines', showlegend:false, line:{color:cols[0], width:1.5} },
      { x:d.b[1].spoke[0], y:d.b[1].spoke[1], mode:'lines', showlegend:false, line:{color:cols[1], width:1.5} },
      { x:d.b[2].spoke[0], y:d.b[2].spoke[1], mode:'lines', showlegend:false, line:{color:cols[2], width:1.5} }
    ];
    var top = [3.4 * r + r, 0];
    var pts = [[0, 0], [m.Ls * m.u[0], m.Ls * m.u[1]], [top[0] * m.n[0], top[0] * m.n[1]],
               [m.Ls * m.u[0] + top[0] * m.n[0], m.Ls * m.u[1] + top[0] * m.n[1]]];
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var pad = 1.5;
    var shapes = m.lane.map(function (lo) {
      return { type:'line', x0:lo * m.n[0], y0:lo * m.n[1],
               x1:m.Ls * m.u[0] + lo * m.n[0], y1:m.Ls * m.u[1] + lo * m.n[1],
               line:{color:'rgba(128,128,128,0.5)', width:1} };
    });
    var layout = {
      margin:{l:10, r:10, t:10, b:10},
      legend:{orientation:'h', y:1.1, x:0.5, xanchor:'center', font:{size:10}},
      xaxis:{range:[Math.min.apply(null, xs) - pad, Math.max.apply(null, xs) + pad], showticklabels:false, zeroline:false, showgrid:false},
      yaxis:{range:[Math.min.apply(null, ys) - pad, Math.max.apply(null, ys) + pad], showticklabels:false, zeroline:false, showgrid:false,
             scaleanchor:'x', scaleratio:1},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'}, shapes:shapes
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    var order = [0, 1, 2].sort(function (a, b) { return m.tfin[a] - m.tfin[b]; });
    var short = ['solid cyl', 'hollow cyl', 'sphere'];
    info.innerHTML = 'a: ' + short.map(function (nm, i) { return nm + ' ' + m.acc[i].toFixed(2); }).join(', ') +
      ' m/s² · winner: <b>' + names[order[0]] + '</b>';
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Race'; }
  function refresh() { stop(); tSim = 0; $('rm-aval').textContent = $('rm-a').value; $('rm-lval').textContent = $('rm-l').value; draw(0); }
  ['rm-a','rm-l'].forEach(function (id) { $(id).addEventListener('input', refresh); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    play.textContent = '⏸ Pause';
    var dt = 1 / 30;
    timer = setInterval(function () {
      tSim += dt; if (tSim > cur.tEnd) tSim = 0;
      var d = dynData(cur, tSim);
      Plotly.restyle(plot, {
        x:[d.b[0].cir[0], d.b[1].cir[0], d.b[2].cir[0], d.hole[0], d.b[0].spoke[0], d.b[1].spoke[0], d.b[2].spoke[0]],
        y:[d.b[0].cir[1], d.b[1].cir[1], d.b[2].cir[1], d.hole[1], d.b[0].spoke[1], d.b[1].spoke[1], d.b[2].spoke[1]]
      }, [0, 1, 2, 3, 4, 5, 6]);
    }, dt * 1000);
  });
  refresh();
});
</script>
```
