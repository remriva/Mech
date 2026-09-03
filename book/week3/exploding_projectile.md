(w3-exploding-projectile)=
# Exploding projectile

*Placeholder text — replace with your own explanation.*

A body of mass $m_b$ moving with velocity $\vec v_b$ explodes into two fragments. Because the
explosion is internal, **total momentum is conserved**:

$$
m_b \vec v_b = m_1 \vec v_1 + m_2 \vec v_2 .
$$

The explosion *releases* energy, so the total kinetic energy of the fragments exceeds that of
the original body: $\Delta E = (E_1 + E_2) - E_b > 0$.

```{admonition} Problem
:class: note
A $1.2\ \mathrm{kg}$ body slides along the $x$-axis at $0.50\ \mathrm{m/s}$ and explodes at the
origin. Fragment 1 ($0.40\ \mathrm{kg}$) flies off at $0.90\ \mathrm{m/s}$ along $+y$. Find the
velocity of fragment 2 and the energy released. Check with the animation.
```

```{raw} html
<div class="tb-widget" id="ep">
  <div class="tb-controls">
    <label>Body speed <em>v<sub>b</sub></em> (m/s, +x): <b><span id="ep-vbval">0.50</span></b>
      <input id="ep-vb" type="range" min="0.1" max="3" step="0.05" value="0.5"></label>
    <label>Body mass <em>m<sub>b</sub></em> (kg): <b><span id="ep-mbval">1.2</span></b>
      <input id="ep-mb" type="range" min="0.6" max="3" step="0.1" value="1.2"></label>
    <label>Fragment 1 mass <em>m₁</em> (kg): <b><span id="ep-m1val">0.4</span></b>
      <input id="ep-m1" type="range" min="0.1" max="2.4" step="0.1" value="0.4"></label>
    <label>Fragment 1 speed <em>v₁</em> (m/s, +y): <b><span id="ep-v1val">0.90</span></b>
      <input id="ep-v1" type="range" min="0.1" max="3" step="0.05" value="0.9"></label>
  </div>
  <div class="tb-buttons">
    <button id="ep-play">▶ Play</button>
    <span class="tb-info" id="ep-info"></span>
  </div>
  <div class="tb-plot" id="ep-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('ep-info'), plot = $('ep-plot'), play = $('ep-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var timer = null, tSim = 0, cur = null, tE = 1.2, TB = 3.0;

  function model() {
    var vb = +$('ep-vb').value, mb = +$('ep-mb').value;
    var m1 = Math.min(+$('ep-m1').value, mb - 0.1), m2 = mb - m1, v1 = +$('ep-v1').value;
    var v2x = mb * vb / m2, v2y = -m1 * v1 / m2;
    var Eb = 0.5 * mb * vb * vb, E1 = 0.5 * m1 * v1 * v1, E2 = 0.5 * m2 * (v2x * v2x + v2y * v2y);
    return { vb:vb, mb:mb, m1:m1, m2:m2, v1:v1, v2x:v2x, v2y:v2y,
             v2:Math.sqrt(v2x * v2x + v2y * v2y), released:(E1 + E2) - Eb };
  }

  function sizeOf(m, mb) { return 10 + 14 * Math.sqrt(m / mb); }

  function draw(t) {
    var d = model(); cur = d;
    var xStart = -d.vb * tE;                      // so body reaches origin at t = tE
    var bombX, f1, f2, com, showBomb = t <= tE;
    if (showBomb) { bombX = xStart + d.vb * t; com = [bombX, 0]; f1 = f2 = null; }
    else {
      var tau = t - tE;
      f1 = [0, d.v1 * tau]; f2 = [d.v2x * tau, d.v2y * tau];
      com = [d.vb * t, 0];
    }
    var data = [
      // fragment paths (vectors from origin)
      { x:f1 ? [0, f1[0]] : [null], y:f1 ? [0, f1[1]] : [null], mode:'lines', line:{color:'#2e6be4', width:2}, hoverinfo:'skip' },
      { x:f2 ? [0, f2[0]] : [null], y:f2 ? [0, f2[1]] : [null], mode:'lines', line:{color:'#2ea44f', width:2}, hoverinfo:'skip' },
      // body
      { x:showBomb ? [bombX] : [null], y:[0], mode:'markers', name:'Body',
        marker:{color:'#e4572e', size:sizeOf(d.mb, d.mb)} },
      // fragments
      { x:f1 ? [f1[0]] : [null], y:f1 ? [f1[1]] : [null], mode:'markers', name:'Fragment 1',
        marker:{color:'#2e6be4', size:sizeOf(d.m1, d.mb)} },
      { x:f2 ? [f2[0]] : [null], y:f2 ? [f2[1]] : [null], mode:'markers', name:'Fragment 2',
        marker:{color:'#2ea44f', size:sizeOf(d.m2, d.mb)} },
      // centre of mass
      { x:[com[0]], y:[com[1]], mode:'markers', name:'Centre of mass',
        marker:{color:'#888', size:7, symbol:'x'} }
    ];
    var xhi = Math.max(d.v2x * TB, d.vb * (tE + TB), 1) + 0.5;
    var yhi = Math.max(d.v1 * TB, 0.5) + 0.3, ylo = Math.min(d.v2y * TB, 0) - 0.3;
    var layout = {
      margin:{l:30, r:15, t:10, b:25}, showlegend:true,
      legend:{orientation:'h', y:1.12, x:1, xanchor:'right', font:{size:10}},
      xaxis:{title:'x (m)', range:[xStart - 0.3, xhi], zeroline:true, zerolinecolor:'rgba(128,128,128,0.4)', gridcolor:'rgba(128,128,128,0.15)'},
      yaxis:{title:'y (m)', range:[ylo, yhi], zeroline:true, zerolinecolor:'rgba(128,128,128,0.4)',
             scaleanchor:'x', scaleratio:1, gridcolor:'rgba(128,128,128,0.15)'},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'}
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    info.innerHTML = 'v₂ = (' + d.v2x.toFixed(2) + ', ' + d.v2y.toFixed(2) + ') m/s · |v₂| = <b>' +
      d.v2.toFixed(2) + ' m/s</b> · energy released = <b>' + d.released.toFixed(3) + ' J</b>';
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Play'; }
  function refresh() {
    stop(); tSim = 0;
    $('ep-vbval').textContent = (+$('ep-vb').value).toFixed(2);
    $('ep-mbval').textContent = (+$('ep-mb').value).toFixed(1);
    $('ep-m1val').textContent = (+$('ep-m1').value).toFixed(1);
    $('ep-v1val').textContent = (+$('ep-v1').value).toFixed(2);
    draw(0);
  }
  ['ep-vb','ep-mb','ep-m1','ep-v1'].forEach(function (id) { $(id).addEventListener('input', refresh); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    play.textContent = '⏸ Pause';
    var dt = 1 / 30;
    timer = setInterval(function () {
      tSim += dt; if (tSim > tE + TB) tSim = 0;   // loop
      draw(tSim);
    }, dt * 1000);
  });
  refresh();
});
</script>
```
