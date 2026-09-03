(w4-weight-pulley)=
# Weight hanging with a pulley

*Placeholder text — replace with your own explanation.*

A block of mass $m_1$ on a frictionless table is connected over a pulley to a hanging mass
$m_2$. If the pulley is **ideal (massless)**, the string tension is the same on both sides and

$$
a = \frac{m_2\, g}{m_1 + m_2}.
$$

If the pulley has mass — moment of inertia $I = \tfrac12 M_p R^2$ for a solid disk — it must be
*spun up* too, so the acceleration drops and the two string tensions are **no longer equal**
($T_\text{vertical} > T_\text{horizontal}$):

$$
a = \frac{m_2\, g}{m_1 + m_2 + I/R^2}.
$$

```{admonition} Problem
:class: note
Set the pulley mass to zero and note that the two tensions are equal. Then make the pulley
massive: which string tension is larger, and why does the block accelerate more slowly? (This is
the same physics as a climber hauling a rock over a frictionless cliff edge — an ideal pulley.)
```

```{raw} html
<div class="tb-widget" id="wp">
  <div class="tb-controls">
    <label>Table mass <em>m₁</em> (kg): <b><span id="wp-m1val">2.0</span></b>
      <input id="wp-m1" type="range" min="0.5" max="5" step="0.1" value="2"></label>
    <label>Hanging mass <em>m₂</em> (kg): <b><span id="wp-m2val">2.0</span></b>
      <input id="wp-m2" type="range" min="0.5" max="5" step="0.1" value="2"></label>
    <label>Pulley mass <em>M<sub>p</sub></em> (kg, 0 = ideal): <b><span id="wp-mpval">1.5</span></b>
      <input id="wp-mp" type="range" min="0" max="5" step="0.1" value="1.5"></label>
    <label>Pulley radius <em>R</em> (m): <b><span id="wp-rval">0.35</span></b>
      <input id="wp-r" type="range" min="0.2" max="0.6" step="0.01" value="0.35"></label>
  </div>
  <div class="tb-buttons">
    <button id="wp-play">▶ Play</button>
    <span class="tb-info" id="wp-info"></span>
  </div>
  <div class="tb-plot" id="wp-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('wp-info'), plot = $('wp-plot'), play = $('wp-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var g = 9.81, bw = 0.5, Ld = 3.0, Lv0 = 1.2, timer = null, tSim = 0, cur = null;

  function model() {
    var m1 = +$('wp-m1').value, m2 = +$('wp-m2').value, Mp = +$('wp-mp').value, R = +$('wp-r').value;
    var I = 0.5 * Mp * R * R, a = m2 * g / (m1 + m2 + I / (R * R));
    var Th = m1 * a, Tv = m2 * (g - a);
    var smax = Ld - 0.1, tEnd = a > 0 ? Math.sqrt(2 * smax / a) : 2;
    return { m1:m1, m2:m2, Mp:Mp, R:R, I:I, a:a, Th:Th, Tv:Tv, smax:smax, tEnd:tEnd };
  }

  function arcPts(R) { var xs = [], ys = []; for (var k = 0; k <= 16; k++) { var th = Math.PI / 2 * (1 - k / 16); xs.push(R * Math.cos(th)); ys.push(R * Math.sin(th)); } return [xs, ys]; }

  function draw(t) {
    var m = model(); cur = m;
    var s = Math.min(0.5 * m.a * t * t, m.smax);
    var R = m.R, tbx = -(R + Ld + bw / 2) + s;        // table block centre x
    var hangTop = -(Lv0 + s), arc = arcPts(R);
    var phi = 0.5 * (m.a / R) * t * t + Math.PI / 4, sp = [[0, R * Math.cos(phi)], [0, R * Math.sin(phi)]];
    var sz = function (mm) { return 20 + 7 * Math.sqrt(mm / 2); };
    var data = [
      { x:[tbx + bw / 2, 0], y:[R, R], mode:'lines', line:{color:'#000', width:2}, hoverinfo:'skip' },
      { x:arc[0], y:arc[1], mode:'lines', line:{color:'#000', width:2}, hoverinfo:'skip' },
      { x:[R, R], y:[0, hangTop], mode:'lines', line:{color:'#000', width:2}, hoverinfo:'skip' },
      { x:[tbx], y:[R + 0.28], mode:'markers', name:'m₁', marker:{color:'#2e6be4', size:sz(m.m1), symbol:'square', line:{color:'#000', width:1.5}} },
      { x:[R], y:[hangTop - 0.28], mode:'markers', name:'m₂', marker:{color:'#2ea44f', size:sz(m.m2), symbol:'square', line:{color:'#000', width:1.5}} },
      { x:sp[0], y:sp[1], mode:'lines', line:{color:'#555', width:2}, hoverinfo:'skip' }
    ];
    var layout = {
      margin:{l:10, r:10, t:10, b:10}, showlegend:false,
      xaxis:{range:[-(R + Ld + bw + 0.5), R + 1], showticklabels:false, zeroline:false, showgrid:false},
      yaxis:{range:[-(Lv0 + m.smax + 0.8), R + 1], showticklabels:false, zeroline:false, showgrid:false, scaleanchor:'x', scaleratio:1},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'},
      shapes:[
        { type:'line', x0:-(R + Ld + bw + 0.5), y0:R, x1:0, y1:R, line:{color:'#888', width:2} },
        { type:'circle', x0:-R, y0:-R, x1:R, y1:R, line:{color:'#888', width:2}, fillcolor:'rgba(150,150,150,0.25)' }
      ]
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    var verdict = m.I < 1e-9 ? 'T equal (ideal pulley)' : (m.Tv > m.Th ? 'T_vert > T_horiz' : 'T_horiz ≥ T_vert');
    info.innerHTML = 'a: <b>' + m.a.toFixed(2) + ' m/s²</b> · T<sub>horiz</sub>: <b>' + m.Th.toFixed(2) +
      ' N</b> · T<sub>vert</sub>: <b>' + m.Tv.toFixed(2) + ' N</b> · I: <b>' + m.I.toFixed(3) + ' kg·m²</b> · ' + verdict;
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Play'; }
  function refresh() { stop(); tSim = 0;
    $('wp-m1val').textContent = (+$('wp-m1').value).toFixed(1);
    $('wp-m2val').textContent = (+$('wp-m2').value).toFixed(1);
    $('wp-mpval').textContent = (+$('wp-mp').value).toFixed(1);
    $('wp-rval').textContent = (+$('wp-r').value).toFixed(2);
    draw(0);
  }
  ['wp-m1','wp-m2','wp-mp','wp-r'].forEach(function (id) { $(id).addEventListener('input', refresh); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    play.textContent = '⏸ Pause';
    var dt = 1 / 30;
    timer = setInterval(function () { tSim += dt; if (tSim > cur.tEnd) tSim = 0; draw(tSim); }, dt * 1000);
  });
  refresh();
});
</script>
```
