(w1-parabolic-flight)=
# Parabolic flight

*Placeholder text — replace with your own explanation.*

When a body is thrown near the Earth's surface and air resistance is neglected, its horizontal
and vertical motions are independent: constant velocity horizontally, constant acceleration
$g$ downward. The result is a **parabolic** trajectory. Launched from height $h$ with speed
$v_0$ at angle $\theta$,

$$
x(t) = v_0\cos\theta\; t, \qquad z(t) = h + v_0\sin\theta\; t - \tfrac{1}{2} g t^2 .
$$

```{admonition} Problem
:class: note
A projectile is launched at $45^\circ$ with an initial speed of $10\ \mathrm{m/s}$ from ground
level. Find the maximum height and the horizontal range. Then use the sliders below to check
your answer and explore how the trajectory changes with each parameter.
```

```{raw} html
<div class="tb-widget" id="pf">
  <div class="tb-controls">
    <label>Gravity <em>g</em> (m/s²): <b><span id="pf-gval">9.81</span></b>
      <input id="pf-g" type="range" min="1.6" max="15" step="0.1" value="9.81"></label>
    <label>Initial speed <em>v₀</em> (m/s): <b><span id="pf-vval">20</span></b>
      <input id="pf-v" type="range" min="1" max="30" step="0.5" value="20"></label>
    <label>Launch angle <em>θ</em> (°): <b><span id="pf-aval">45</span></b>
      <input id="pf-a" type="range" min="0" max="90" step="1" value="45"></label>
    <label>Initial height <em>h</em> (m): <b><span id="pf-hval">5</span></b>
      <input id="pf-h" type="range" min="0" max="50" step="1" value="5"></label>
  </div>
  <div class="tb-buttons">
    <button id="pf-play">▶ Play</button>
    <span class="tb-info" id="pf-info"></span>
  </div>
  <div class="tb-plot" id="pf-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('pf-info'), plot = $('pf-plot'), play = $('pf-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var timer = null, cur = null;

  function compute() {
    var g = +$('pf-g').value, v0 = +$('pf-v').value,
        angle = +$('pf-a').value, h = +$('pf-h').value;
    var th = angle * Math.PI / 180, v0x = v0 * Math.cos(th), v0z = v0 * Math.sin(th);
    var disc = Math.max(0, v0z * v0z + 2 * g * h);
    var tTot = g > 0 ? (v0z + Math.sqrt(disc)) / g : 0;
    var N = 200, x = [], z = [];
    for (var i = 0; i <= N; i++) {
      var t = tTot * i / N;
      x.push(v0x * t); z.push(h + v0z * t - 0.5 * g * t * t);
    }
    var tMax = g > 0 ? v0z / g : 0;
    return { g:g, v0:v0, h:h, th:th, x:x, z:z,
             xMax:v0x * tMax, zMax:h + v0z * v0z / (2 * g),
             range:x[x.length - 1], tTot:tTot };
  }

  function draw(ballIdx) {
    var d = compute(); cur = d;
    var aLen = Math.min(Math.max(d.v0 / 5, 2), 8);
    var bx = ballIdx == null ? 0 : d.x[ballIdx];
    var bz = ballIdx == null ? d.h : d.z[ballIdx];
    var xhi = Math.max(d.range * 1.1, 1), yhi = Math.max(d.zMax, d.h) * 1.3 + 1;
    var data = [
      { x:d.x, y:d.z, mode:'lines', name:'Trajectory', line:{color:'#e4572e', width:3} },
      { x:[0], y:[d.h], mode:'markers', name:'Start', marker:{color:'#e4572e', size:11} },
      { x:[d.xMax], y:[d.zMax], mode:'markers', name:'Max height', marker:{color:'#2e6be4', size:9} },
      { x:[d.range], y:[0], mode:'markers', name:'Impact', marker:{color:'#2ea44f', size:11} },
      { x:[bx], y:[bz], mode:'markers', name:'Ball', showlegend:false,
        marker:{color:'#000', size:13, line:{color:'#fff', width:2}} }
    ];
    var layout = {
      margin:{l:55, r:15, t:10, b:45},
      xaxis:{title:'Horizontal distance (m)', range:[0, xhi], zeroline:false, gridcolor:'rgba(128,128,128,0.25)'},
      yaxis:{title:'Vertical height (m)', range:[0, yhi], zeroline:false, gridcolor:'rgba(128,128,128,0.25)'},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'},
      legend:{orientation:'h', y:1.12, x:1, xanchor:'right'},
      shapes:[{type:'line', x0:0, x1:xhi, y0:0, y1:0, line:{color:'#888', width:1, dash:'dot'}}],
      annotations:[{ x:aLen*Math.cos(d.th), y:d.h + aLen*Math.sin(d.th), ax:0, ay:d.h,
                     xref:'x', yref:'y', axref:'x', ayref:'y',
                     showarrow:true, arrowhead:3, arrowwidth:2, arrowcolor:'#333' }]
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    info.innerHTML = 'Range: <b>' + d.range.toFixed(1) + ' m</b> · Max height: <b>' +
      d.zMax.toFixed(1) + ' m</b> · Flight time: <b>' + d.tTot.toFixed(2) + ' s</b>';
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Play'; }
  function refresh() {
    stop();
    $('pf-gval').textContent = (+$('pf-g').value).toFixed(2);
    $('pf-vval').textContent = $('pf-v').value;
    $('pf-aval').textContent = $('pf-a').value;
    $('pf-hval').textContent = $('pf-h').value;
    draw(null);
  }
  ['pf-g','pf-v','pf-a','pf-h'].forEach(function (id) { $(id).addEventListener('input', refresh); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    var i = 0; play.textContent = '⏸ Pause';
    timer = setInterval(function () {
      Plotly.restyle(plot, { x:[[cur.x[i]]], y:[[cur.z[i]]] }, [4]);
      if (i++ > 200) stop();
    }, 20);
  });
  refresh();
});
</script>
```
