(w1-spring-loaded-gun)=
# Spring-loaded gun

*Placeholder text — replace with your own explanation.*

A block of mass $m$ is pushed against a spring of stiffness $k$, compressing it from its natural
length $L_0$ to $L_\text{comp}$, then released. While in contact the block undergoes simple
harmonic motion; it leaves the spring at the natural length with speed

$$
v_\text{max} = \omega A = \sqrt{\tfrac{k}{m}}\,(L_0 - L_\text{comp}),
$$

after which it coasts at constant velocity (no friction). All the stored elastic energy
$\tfrac{1}{2}k A^2$ has become kinetic energy.

```{admonition} Problem
:class: note
With $m = 1.0\ \mathrm{kg}$, $k = 0.5\ \mathrm{N/m}$, $L_0 = 5.0\ \mathrm{m}$ and
$L_\text{comp} = 0.5\ \mathrm{m}$, find the maximum speed and the maximum acceleration of the
block. Verify with the readout as it launches.
```

```{raw} html
<div class="tb-widget" id="sg">
  <div class="tb-controls">
    <label>Mass <em>m</em> (kg): <b><span id="sg-mval">1.0</span></b>
      <input id="sg-m" type="range" min="0.5" max="5" step="0.1" value="1"></label>
    <label>Spring constant <em>k</em> (N/m): <b><span id="sg-kval">0.5</span></b>
      <input id="sg-k" type="range" min="0.1" max="5" step="0.1" value="0.5"></label>
    <label>Natural length <em>L₀</em> (m): <b><span id="sg-l0val">5.0</span></b>
      <input id="sg-l0" type="range" min="3" max="8" step="0.1" value="5"></label>
    <label>Compressed length <em>L<sub>comp</sub></em> (m): <b><span id="sg-lcval">0.5</span></b>
      <input id="sg-lc" type="range" min="0.5" max="4" step="0.1" value="0.5"></label>
  </div>
  <div class="tb-buttons">
    <button id="sg-play">▶ Play</button>
    <span class="tb-info" id="sg-info"></span>
  </div>
  <div class="tb-plot" id="sg-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('sg-info'), plot = $('sg-plot'), play = $('sg-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var bs = 0.5, XMAX = 10, timer = null, cur = null;

  function springPts(x1, nodes, width) {
    var x0 = 0, y = bs / 2, len = x1 - x0, xs = [], ys = [];
    if (len <= 0) return [[0], [y]];
    for (var i = 0; i <= nodes; i++) {
      var bx = x0 + len * i / nodes, by = y;
      if (i > 0 && i < nodes) by += (i % 2 === 1 ? width : -width);
      xs.push(bx); ys.push(by);
    }
    return [xs, ys];
  }

  function compute() {
    var m = +$('sg-m').value, k = +$('sg-k').value, L0 = +$('sg-l0').value;
    var Lc = Math.min(+$('sg-lc').value, L0 - 0.1);
    var A = L0 - Lc, omega = Math.sqrt(k / m), t1 = Math.PI / (2 * omega);
    var dur = 10, fps = 20, nf = dur * fps, dt = dur / nf;
    var pos = [], vel = [], acc = [];
    for (var i = 0; i <= nf; i++) {
      var t = i * dt, p, v, a;
      if (t <= t1) { p = Lc + A * (1 - Math.cos(omega * t)); v = A * omega * Math.sin(omega * t); a = k * (L0 - p) / m; }
      else { p = L0 + omega * A * (t - t1); v = omega * A; a = 0; }
      pos.push(p); vel.push(v); acc.push(a);
    }
    return { m:m, k:k, L0:L0, Lc:Lc, A:A, pos:pos, vel:vel, acc:acc, nf:nf };
  }

  function frameTraces(d, i) {
    var p = d.pos[i], sp = springPts(Math.min(p, d.L0), 15, 0.1);
    return { spring:sp, box:[[p], [bs / 2]] };
  }

  function draw(idx) {
    var d = compute(); cur = d;
    var i = idx == null ? 0 : idx, ft = frameTraces(d, i);
    var data = [
      { x:ft.spring[0], y:ft.spring[1], mode:'lines', name:'Spring', line:{color:'#2e6be4', width:1.5} },
      { x:ft.box[0], y:ft.box[1], mode:'markers', name:'Block',
        marker:{color:'skyblue', size:22, symbol:'square', line:{color:'#000', width:1.5}} }
    ];
    var layout = {
      margin:{l:15, r:15, t:10, b:20}, showlegend:false,
      xaxis:{range:[-0.3, XMAX], zeroline:false, showticklabels:false, gridcolor:'rgba(128,128,128,0.15)'},
      yaxis:{range:[-0.6, 2], zeroline:false, showticklabels:false, gridcolor:'rgba(128,128,128,0.15)'},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'},
      shapes:[
        { type:'line', x0:0, y0:0, x1:XMAX, y1:0, line:{color:'#888', width:2} },
        { type:'line', x0:0, y0:0, x1:0, y1:bs * 2, line:{color:'#888', width:3} },
        { type:'line', x0:d.Lc, y0:0, x1:d.Lc, y1:bs * 2, line:{color:'#bbb', width:1, dash:'dot'} },
        { type:'line', x0:d.L0, y0:0, x1:d.L0, y1:bs * 2, line:{color:'#bbb', width:1, dash:'dot'} }
      ],
      annotations:[
        { x:d.Lc, y:-0.35, text:'L_comp', showarrow:false, font:{size:11} },
        { x:d.L0, y:-0.35, text:'L₀', showarrow:false, font:{size:11} }
      ]
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    setInfo(d, i);
  }

  function setInfo(d, i) {
    var comp = Math.max(d.L0 - d.pos[i], 0), U = 0.5 * d.k * comp * comp, KE = 0.5 * d.m * d.vel[i] * d.vel[i];
    info.innerHTML = 'x: <b>' + d.pos[i].toFixed(2) + ' m</b> · v: <b>' + d.vel[i].toFixed(2) +
      ' m/s</b> · a: <b>' + d.acc[i].toFixed(2) + ' m/s²</b> · PE: <b>' + U.toFixed(2) +
      ' J</b> · KE: <b>' + KE.toFixed(2) + ' J</b>';
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Play'; }
  function refresh() {
    stop();
    $('sg-mval').textContent = (+$('sg-m').value).toFixed(1);
    $('sg-kval').textContent = (+$('sg-k').value).toFixed(1);
    $('sg-l0val').textContent = (+$('sg-l0').value).toFixed(1);
    $('sg-lcval').textContent = (+$('sg-lc').value).toFixed(1);
    draw(null);
  }
  ['sg-m','sg-k','sg-l0','sg-lc'].forEach(function (id) { $(id).addEventListener('input', refresh); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    var i = 0; play.textContent = '⏸ Pause';
    timer = setInterval(function () {
      var ft = frameTraces(cur, i);
      Plotly.restyle(plot, { x:[ft.spring[0], ft.box[0]], y:[ft.spring[1], ft.box[1]] }, [0, 1]);
      setInfo(cur, i);
      if (i++ >= cur.nf) stop();
    }, 1000 / 20);
  });
  refresh();
});
</script>
```
