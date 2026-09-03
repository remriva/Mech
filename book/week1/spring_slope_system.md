(w1-spring-slope-system)=
# Spring–slope system

*Placeholder text — replace with your own explanation.*

This example combines everything from the week. A spring launches a block of mass $m$ along the
ground; the block then climbs a curved slope. Along the way we track the three energy stores —
elastic $\tfrac{1}{2}kA^2$, kinetic $\tfrac{1}{2}mv^2$ and gravitational $mgh$.

Crucially, this version adds **friction**. With a coefficient $\mu$, the block loses mechanical
energy to a friction force $\mu N$ on the ground and up the slope, so it no longer returns all
its energy and reaches a lower maximum height. Setting $\mu = 0$ recovers the ideal,
energy-conserving case.

```{admonition} Problem
:class: note
For the ideal (frictionless, $\mu = 0$) case, find the maximum speed, the maximum acceleration,
and the maximum height reached on the slope. Then increase $\mu$ and see how much height (and
mechanical energy) friction costs you — with enough friction the block never reaches the slope
at all.
```

```{raw} html
<div class="tb-widget" id="ss">
  <div class="tb-controls">
    <label>Mass <em>m</em> (kg): <b><span id="ss-mval">1.0</span></b>
      <input id="ss-m" type="range" min="0.5" max="5" step="0.1" value="1"></label>
    <label>Spring constant <em>k</em> (N/m): <b><span id="ss-kval">2.0</span></b>
      <input id="ss-k" type="range" min="0.1" max="5" step="0.1" value="2"></label>
    <label>Natural length <em>L₀</em> (m): <b><span id="ss-l0val">5.0</span></b>
      <input id="ss-l0" type="range" min="3" max="7" step="0.1" value="5"></label>
    <label>Compressed length <em>L<sub>comp</sub></em> (m): <b><span id="ss-lcval">1.0</span></b>
      <input id="ss-lc" type="range" min="0.5" max="4" step="0.1" value="1"></label>
    <label>Friction coefficient <em>μ</em>: <b><span id="ss-uval">0.15</span></b>
      <input id="ss-u" type="range" min="0" max="0.5" step="0.01" value="0.15"></label>
  </div>
  <div class="tb-buttons">
    <button id="ss-play">▶ Play</button>
    <span class="tb-info" id="ss-info"></span>
  </div>
  <div class="tb-plot" id="ss-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('ss-info'), plot = $('ss-plot'), play = $('ss-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var g = 9.81, bs = 0.5, groundLen = 10, slopeLen = 5, maxH = 1.5;
  var c = maxH / (slopeLen * slopeLen), timer = null, cur = null;

  function slopeCurve() {
    var xs = [0, groundLen], ys = [0, 0];
    for (var i = 1; i <= 30; i++) {
      var xr = slopeLen * i / 30;
      xs.push(groundLen + xr); ys.push(c * xr * xr);
    }
    return { x:xs, y:ys };
  }

  function springPts(x1) {
    var y = bs / 4, len = x1, xs = [], ys = [], nodes = 15, width = 0.1;
    if (len <= 0) return [[0], [y]];
    for (var i = 0; i <= nodes; i++) {
      var bx = len * i / nodes, by = y;
      if (i > 0 && i < nodes) by += (i % 2 === 1 ? width : -width);
      xs.push(bx); ys.push(by);
    }
    return [xs, ys];
  }

  function compute() {
    var m = +$('ss-m').value, k = +$('ss-k').value, L0 = +$('ss-l0').value;
    var Lc = Math.min(+$('ss-lc').value, L0 - 0.1), mu = +$('ss-u').value;
    var A = L0 - Lc, omega = Math.sqrt(k / m), t1 = Math.PI / (2 * omega);
    var dur = 12, fps = 20, nf = dur * fps, dt = dur / nf, nsub = 5, sdt = dt / nsub;
    var pos = [], yy = [], vel = [], acc = [], phase = [];
    var x = Lc, v = 0, y = 0, launched = false, a = 0, ph = 0;
    for (var i = 0; i <= nf; i++) {
      var t = i * dt;
      if (t <= t1) {
        x = Lc + A * (1 - Math.cos(omega * t)); v = A * omega * Math.sin(omega * t);
        y = 0; a = k * (L0 - x) / m; ph = 0;
      } else {
        if (!launched) { x = L0; v = omega * A; y = 0; launched = true; }
        for (var s = 0; s < nsub; s++) {
          var phi, aAl;
          if (x < groundLen) { phi = 0; aAl = v > 0 ? -mu * g : 0; }
          else {
            var xr = Math.min(x - groundLen, slopeLen);
            phi = Math.atan(2 * c * xr);
            aAl = -g * Math.sin(phi) - (v > 0 ? mu * g * Math.cos(phi) : 0);
          }
          v = v + aAl * sdt; if (v < 0) v = 0;
          x = x + v * Math.cos(phi) * sdt;
          if (x - groundLen > slopeLen) { x = groundLen + slopeLen; v = 0; }
          y = x > groundLen ? c * Math.pow(Math.min(x - groundLen, slopeLen), 2) : 0;
          a = aAl;
        }
        ph = x < groundLen ? 1 : 2;
      }
      pos.push(x); yy.push(y); vel.push(v); acc.push(a); phase.push(ph);
    }
    var hmax = Math.max.apply(null, yy);
    return { m:m, k:k, L0:L0, Lc:Lc, mu:mu, pos:pos, yy:yy, vel:vel, acc:acc, phase:phase, nf:nf, hmax:hmax };
  }

  function frameTraces(d, i) {
    var x = d.pos[i], sp = springPts(Math.min(x, d.L0));
    return { spring:sp, box:[[x], [d.yy[i] + bs / 4]] };
  }

  function draw(idx) {
    var d = compute(); cur = d;
    var i = idx == null ? 0 : idx, ft = frameTraces(d, i), sc = slopeCurve();
    var data = [
      { x:sc.x, y:sc.y, mode:'lines', name:'Track', line:{color:'#888', width:3} },
      { x:ft.spring[0], y:ft.spring[1], mode:'lines', name:'Spring', line:{color:'#2e6be4', width:1.5} },
      { x:ft.box[0], y:ft.box[1], mode:'markers', name:'Block',
        marker:{color:'skyblue', size:18, symbol:'square', line:{color:'#000', width:1.5}} }
    ];
    var layout = {
      margin:{l:15, r:15, t:10, b:20}, showlegend:false,
      xaxis:{range:[-0.3, groundLen + slopeLen + 1], zeroline:false, showticklabels:false, gridcolor:'rgba(128,128,128,0.15)'},
      yaxis:{range:[-0.6, maxH + 0.6], zeroline:false, showticklabels:false, gridcolor:'rgba(128,128,128,0.15)'},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'},
      shapes:[
        { type:'line', x0:0, y0:0, x1:0, y1:bs * 2, line:{color:'#888', width:3} },
        { type:'line', x0:d.Lc, y0:0, x1:d.Lc, y1:bs * 2, line:{color:'#bbb', width:1, dash:'dot'} },
        { type:'line', x0:d.L0, y0:0, x1:d.L0, y1:bs * 2, line:{color:'#bbb', width:1, dash:'dot'} },
        { type:'line', x0:groundLen, y0:0, x1:groundLen, y1:maxH, line:{color:'#e4572e', width:1, dash:'dot'} }
      ],
      annotations:[
        { x:d.Lc, y:-0.4, text:'L_comp', showarrow:false, font:{size:10} },
        { x:d.L0, y:-0.4, text:'L₀', showarrow:false, font:{size:10} },
        { x:groundLen, y:maxH + 0.2, text:'slope', showarrow:false, font:{size:10} }
      ]
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    setInfo(d, i);
  }

  function setInfo(d, i) {
    var comp = Math.max(d.L0 - d.pos[i], 0), U = 0.5 * d.k * comp * comp;
    var KE = 0.5 * d.m * d.vel[i] * d.vel[i], Ug = d.m * g * d.yy[i];
    var names = ['spring', 'ground', 'slope'];
    info.innerHTML = '[' + names[d.phase[i]] + '] v: <b>' + d.vel[i].toFixed(2) + ' m/s</b> · h: <b>' +
      d.yy[i].toFixed(2) + ' m</b> · PE<sub>spr</sub>: <b>' + U.toFixed(1) + ' J</b> · KE: <b>' +
      KE.toFixed(1) + ' J</b> · PE<sub>grav</sub>: <b>' + Ug.toFixed(1) + ' J</b> · E: <b>' +
      (U + KE + Ug).toFixed(1) + ' J</b> · h<sub>max</sub>: <b>' + d.hmax.toFixed(2) + ' m</b>';
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Play'; }
  function refresh() {
    stop();
    $('ss-mval').textContent = (+$('ss-m').value).toFixed(1);
    $('ss-kval').textContent = (+$('ss-k').value).toFixed(1);
    $('ss-l0val').textContent = (+$('ss-l0').value).toFixed(1);
    $('ss-lcval').textContent = (+$('ss-lc').value).toFixed(1);
    $('ss-uval').textContent = (+$('ss-u').value).toFixed(2);
    draw(null);
  }
  ['ss-m','ss-k','ss-l0','ss-lc','ss-u'].forEach(function (id) { $(id).addEventListener('input', refresh); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    var i = 0; play.textContent = '⏸ Pause';
    timer = setInterval(function () {
      var ft = frameTraces(cur, i);
      Plotly.restyle(plot, { x:[ft.spring[0], ft.box[0]], y:[ft.spring[1], ft.box[1]] }, [1, 2]);
      setInfo(cur, i);
      if (i++ >= cur.nf) stop();
    }, 1000 / 20);
  });
  refresh();
});
</script>
```
