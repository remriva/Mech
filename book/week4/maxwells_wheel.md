(w4-maxwells-wheel)=
# Maxwell's wheel

*Placeholder text — replace with your own explanation.*

A wheel hangs from two strings wound around a thin axle of radius $r$. As it falls it must spin,
so gravity's work is shared between translation and rotation. With $I_S = \tfrac12 M R^2$ the
downward acceleration is tiny,

$$
a = \frac{g}{1 + I_S / (M r^2)} = \frac{g}{1 + R^2/(2r^2)},
$$

because almost all the energy goes into spin. At the bottom the wheel keeps turning the same
way, the strings rewind, and it climbs back up — trading kinetic energy for potential energy over
and over.

```{admonition} Problem
:class: note
Explain why the wheel falls so slowly. Track how energy moves between translational kinetic,
rotational kinetic, and potential as it descends and rises. What happens to the peak height each
cycle when there are small losses?
```

```{raw} html
<div class="tb-widget" id="mw">
  <div class="tb-controls">
    <label>Wheel mass <em>M</em> (kg): <b><span id="mw-mval">1.0</span></b>
      <input id="mw-m" type="range" min="0.5" max="3" step="0.1" value="1"></label>
    <label>Wheel radius <em>R</em> (m): <b><span id="mw-rval">0.50</span></b>
      <input id="mw-r" type="range" min="0.2" max="0.8" step="0.02" value="0.5"></label>
    <label>Axle radius <em>r</em> (m): <b><span id="mw-arval">0.030</span></b>
      <input id="mw-ar" type="range" min="0.01" max="0.08" step="0.005" value="0.03"></label>
    <label>Drop height <em>h</em> (m): <b><span id="mw-hval">2.0</span></b>
      <input id="mw-h" type="range" min="1" max="3" step="0.1" value="2"></label>
    <label>Loss per turn <em>damping</em>: <b><span id="mw-dval">0.05</span></b>
      <input id="mw-d" type="range" min="0" max="0.3" step="0.01" value="0.05"></label>
  </div>
  <div class="tb-buttons">
    <button id="mw-play">▶ Play</button>
    <span class="tb-info" id="mw-info"></span>
  </div>
  <div class="tb-plot" id="mw-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('mw-info'), plot = $('mw-plot'), play = $('mw-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var g = 9.81, timer = null;
  var y = 0, v = 0, phi = 0, mode = 'down', P = null;
  var unit = []; for (var k = 0; k <= 48; k++) { var th = 2 * Math.PI * k / 48; unit.push([Math.cos(th), Math.sin(th)]); }

  function model() {
    var M = +$('mw-m').value, R = +$('mw-r').value, r = +$('mw-ar').value, h = +$('mw-h').value, damp = +$('mw-d').value;
    var Is = 0.5 * M * R * R, a = g / (1 + Is / (M * r * r)), Tf = Math.sqrt(2 * h / a);
    return { M:M, R:R, r:r, h:h, damp:damp, Is:Is, a:a, Tf:Tf };
  }

  function circle(cx, cy, rad) { var xs = [], ys = []; for (var k = 0; k < unit.length; k++) { xs.push(cx + rad * unit[k][0]); ys.push(cy + rad * unit[k][1]); } return [xs, ys]; }

  function draw() {
    var Yc = -(P.r + y);
    var wheel = circle(0, Yc, P.R), axle = circle(0, Yc, P.r);
    var tip = [P.R * Math.cos(phi), Yc + P.R * Math.sin(phi)];
    var data = [
      { x:wheel[0], y:wheel[1], mode:'lines', line:{color:'#666', width:3}, fill:'toself', fillcolor:'rgba(150,150,150,0.25)', hoverinfo:'skip' },
      { x:axle[0], y:axle[1], mode:'lines', line:{color:'#000', width:1.5}, hoverinfo:'skip' },
      { x:[0, tip[0]], y:[Yc, tip[1]], mode:'lines', line:{color:'#000', width:2}, hoverinfo:'skip' },
      { x:[0, 0], y:[0, -y], mode:'lines', line:{color:'#000', width:1.5}, hoverinfo:'skip' }
    ];
    var layout = {
      margin:{l:10, r:10, t:10, b:10}, showlegend:false,
      xaxis:{range:[-1.3 * P.R, 1.3 * P.R], showticklabels:false, zeroline:false, showgrid:false},
      yaxis:{range:[-(P.r + P.h + P.R) - 0.3, P.R + 0.3], showticklabels:false, zeroline:false, showgrid:false, scaleanchor:'x', scaleratio:1},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'},
      shapes:[{ type:'line', x0:-0.8 * P.R, y0:0, x1:0.8 * P.R, y1:0, line:{color:'#888', width:3} }]
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    setInfo();
  }

  function restyleFrame() {
    var Yc = -(P.r + y);
    var wheel = circle(0, Yc, P.R), axle = circle(0, Yc, P.r);
    var tip = [P.R * Math.cos(phi), Yc + P.R * Math.sin(phi)];
    Plotly.restyle(plot, { x:[wheel[0], axle[0], [0, tip[0]], [0, 0]], y:[wheel[1], axle[1], [Yc, tip[1]], [0, -y]] }, [0, 1, 2, 3]);
    setInfo();
  }

  function setInfo() {
    var omega = (mode === 'down' ? v : -v) / P.r;
    var Kt = 0.5 * P.M * v * v, Kr = 0.5 * P.Is * omega * omega, U = P.M * g * (P.h - y);
    info.innerHTML = 'a: <b>' + P.a.toFixed(3) + ' m/s²</b> · phase: <b>' + mode + '</b> · KE<sub>trans</sub>: <b>' +
      Kt.toFixed(2) + ' J</b> · KE<sub>rot</sub>: <b>' + Kr.toFixed(2) + ' J</b> · U: <b>' + U.toFixed(2) + ' J</b>';
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Play'; }
  function refresh() { stop(); P = model(); y = 0; v = 0; phi = 0; mode = 'down'; draw(); }
  ['mw-m','mw-r','mw-ar','mw-h','mw-d'].forEach(function (id) {
    $(id).addEventListener('input', function () {
      $('mw-mval').textContent = (+$('mw-m').value).toFixed(1);
      $('mw-rval').textContent = (+$('mw-r').value).toFixed(2);
      $('mw-arval').textContent = (+$('mw-ar').value).toFixed(3);
      $('mw-hval').textContent = (+$('mw-h').value).toFixed(1);
      $('mw-dval').textContent = (+$('mw-d').value).toFixed(2);
      refresh();
    });
  });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    play.textContent = '⏸ Pause';
    var dt = 1 / 60;
    timer = setInterval(function () {
      for (var sub = 0; sub < 2; sub++) {
        var a = mode === 'down' ? P.a : -P.a;
        v += a * (dt / 2); y += v * (dt / 2);
        var omega = (mode === 'down' ? v : -v) / P.r; phi += omega * (dt / 2);
        if (mode === 'down' && y >= P.h) { y = P.h; v = -v * (1 - P.damp); mode = 'up'; }
        else if (mode === 'up' && y <= 0) { y = 0; v = -v * (1 - P.damp); mode = 'down'; }
      }
      restyleFrame();
    }, dt * 1000);
  });
  refresh();
});
</script>
```
