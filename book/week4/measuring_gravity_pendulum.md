(w4-measuring-gravity)=
# Measuring gravity with a swing pendulum

*Placeholder text — replace with your own explanation.*

For small swings a simple pendulum of length $L$ is a harmonic oscillator with period

$$
T = 2\pi\sqrt{\frac{L}{g}} \quad\Longrightarrow\quad g = \frac{4\pi^2 L}{T^2}.
$$

So by timing the swing of a pendulum of known length you can **measure the local
gravitational acceleration** — a classic field experiment.

```{admonition} Problem
:class: note
A pendulum of length $L = 5\ \mathrm{m}$ is observed to have the period shown below. Calculate the
gravitational acceleration. Is this measurement more likely from **Mars** or the **Moon**? (Use
the "closest to" hint, then reason about it.)
```

```{raw} html
<div class="tb-widget" id="pg">
  <div class="tb-controls">
    <label>Pendulum length <em>L</em> (m): <b><span id="pg-lval">5.0</span></b>
      <input id="pg-l" type="range" min="1" max="10" step="0.1" value="5"></label>
    <label>Gravity <em>g</em> (m/s²): <b><span id="pg-gval">3.73</span></b>
      <input id="pg-g" type="range" min="1" max="15" step="0.01" value="3.73"></label>
  </div>
  <div class="tb-buttons">
    <button id="pg-play">▶ Play</button>
    <span class="tb-info" id="pg-info"></span>
  </div>
  <div class="tb-plot" id="pg-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('pg-info'), plot = $('pg-plot'), play = $('pg-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var theta0 = 0.25, timer = null, tSim = 0, cur = null, trailX = [], trailY = [];
  var bodies = [['Earth', 9.81], ['Mars', 3.71], ['Moon', 1.62]];

  function model() {
    var L = +$('pg-l').value, g = +$('pg-g').value;
    var omega = Math.sqrt(g / L), T = 2 * Math.PI / omega;
    var closest = bodies[0], best = 1e9;
    bodies.forEach(function (b) { var d = Math.abs(g - b[1]); if (d < best) { best = d; closest = b; } });
    return { L:L, g:g, omega:omega, T:T, closest:closest[0] };
  }

  function draw(th) {
    var m = model(); cur = m;
    var x = m.L * Math.sin(th), y = -m.L * Math.cos(th), lim = m.L * 1.2;
    var data = [
      { x:trailX, y:trailY, mode:'lines', line:{color:'rgba(46,107,228,0.5)', width:1}, hoverinfo:'skip' },
      { x:[0, x], y:[0, y], mode:'lines', line:{color:'#000', width:2}, hoverinfo:'skip' },
      { x:[x], y:[y], mode:'markers', marker:{color:'skyblue', size:20, line:{color:'#000', width:1.5}} },
      { x:[0], y:[0], mode:'markers', marker:{color:'#000', size:8} }
    ];
    var layout = {
      margin:{l:10, r:10, t:10, b:10}, showlegend:false,
      xaxis:{range:[-lim, lim], showticklabels:false, zeroline:false, showgrid:false},
      yaxis:{range:[-lim, m.L * 0.2], showticklabels:false, zeroline:false, showgrid:false, scaleanchor:'x', scaleratio:1},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'},
      shapes:[{ type:'line', x0:-lim * 0.5, y0:0, x1:lim * 0.5, y1:0, line:{color:'#888', width:3} }]
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    setInfo(m);
  }

  function setInfo(m) {
    info.innerHTML = 'period T: <b>' + m.T.toFixed(2) + ' s</b> · measured g: <b>' + m.g.toFixed(2) +
      ' m/s²</b> · closest to: <b>' + m.closest + '</b>';
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Play'; }
  function refresh() { stop(); tSim = 0; trailX = []; trailY = [];
    $('pg-lval').textContent = (+$('pg-l').value).toFixed(1);
    $('pg-gval').textContent = (+$('pg-g').value).toFixed(2);
    draw(theta0);
  }
  ['pg-l','pg-g'].forEach(function (id) { $(id).addEventListener('input', refresh); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    play.textContent = '⏸ Pause';
    var dt = 1 / 60;
    timer = setInterval(function () {
      tSim += dt;
      var th = theta0 * Math.cos(cur.omega * tSim);
      var x = cur.L * Math.sin(th), y = -cur.L * Math.cos(th);
      trailX.push(x); trailY.push(y);
      if (trailX.length > 400) { trailX.shift(); trailY.shift(); }
      Plotly.restyle(plot, { x:[trailX, [0, x], [x]], y:[trailY, [0, y], [y]] }, [0, 1, 2]);
    }, dt * 1000);
  });
  refresh();
});
</script>
```
