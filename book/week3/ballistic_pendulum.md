(w3-ballistic-pendulum)=
# Ballistic pendulum

*Placeholder text — replace with your own explanation.*

A bullet of mass $m_b$ and speed $v_b$ embeds itself in a hanging block of mass $M$. The
collision is **perfectly inelastic**, so momentum is conserved but kinetic energy is not:

$$
v = \frac{m_b}{m_b + M}\, v_b .
$$

The combined mass then swings up, now conserving energy, to a height
$h = v^2 / (2g)$ — i.e. an angle $\theta_\text{max} = \arccos\!\left(1 - h/L\right)$.

```{admonition} Problem
:class: note
A $50\ \mathrm{g}$ bullet travelling at $200\ \mathrm{m/s}$ embeds in a $500\ \mathrm{g}$
pendulum block. Find the speed of the block just after impact and the height it rises to. Vary
the masses, bullet speed and string length below.
```

```{raw} html
<div class="tb-widget" id="bp">
  <div class="tb-controls">
    <label>Bullet mass <em>m<sub>b</sub></em> (g): <b><span id="bp-mbval">50</span></b>
      <input id="bp-mb" type="range" min="5" max="200" step="5" value="50"></label>
    <label>Block mass <em>M</em> (g): <b><span id="bp-mpval">500</span></b>
      <input id="bp-mp" type="range" min="100" max="2000" step="10" value="500"></label>
    <label>Bullet speed <em>v<sub>b</sub></em> (m/s): <b><span id="bp-vbval">60</span></b>
      <input id="bp-vb" type="range" min="20" max="400" step="5" value="60"></label>
    <label>String length <em>L</em> (m): <b><span id="bp-lval">2.0</span></b>
      <input id="bp-l" type="range" min="0.5" max="3" step="0.1" value="2"></label>
  </div>
  <div class="tb-buttons">
    <button id="bp-play">▶ Play</button>
    <span class="tb-info" id="bp-info"></span>
  </div>
  <div class="tb-plot" id="bp-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('bp-info'), plot = $('bp-plot'), play = $('bp-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var g = 9.81, timer = null, cur = null;
  var phase = 'hit', tHit = 1.0, tApproach = 0, theta = 0, omega = 0, approachX = 0;

  function model() {
    var mb = (+$('bp-mb').value) / 1000, M = (+$('bp-mp').value) / 1000;
    var vb = +$('bp-vb').value, L = +$('bp-l').value;
    var v = mb / (mb + M) * vb, h = v * v / (2 * g);
    var cosT = 1 - h / L, thetaMax = Math.acos(Math.max(-1, Math.min(1, cosT)));
    return { mb:mb, M:M, vb:vb, L:L, v:v, h:h, thetaMax:thetaMax, omega0:v / L, over:(h >= 2 * L) };
  }

  function frame(d, th, bulletX) {
    var bx = d.L * Math.sin(th), by = -d.L * Math.cos(th);   // bob position (pivot at origin)
    var bulletPt = bulletX == null ? [null, null] : [bulletX, -d.L];
    return {
      string:[[0, bx], [0, by]],
      bob:[[bx], [by]],
      bullet:bulletPt
    };
  }

  function draw(d, th, bulletX) {
    var f = frame(d, th, bulletX);
    var lim = d.L * 1.3;
    var data = [
      { x:f.string[0], y:f.string[1], mode:'lines', name:'String', line:{color:'#000', width:2} },
      { x:f.bob[0], y:f.bob[1], mode:'markers', name:'Block',
        marker:{color:'#8a5a2b', size:24 + 8 * Math.sqrt(d.M / 0.5), line:{color:'#000', width:1}} },
      { x:[f.bullet[0]], y:[f.bullet[1]], mode:'markers', name:'Bullet',
        marker:{color:'#e4572e', size:9} }
    ];
    var layout = {
      margin:{l:20, r:15, t:10, b:20}, showlegend:false,
      xaxis:{range:[-lim, lim], zeroline:false, showticklabels:false, gridcolor:'rgba(128,128,128,0.15)'},
      yaxis:{range:[-lim, 0.35], zeroline:false, showticklabels:false,
             scaleanchor:'x', scaleratio:1, gridcolor:'rgba(128,128,128,0.15)'},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'},
      shapes:[{ type:'line', x0:-lim * 0.5, y0:0, x1:lim * 0.5, y1:0, line:{color:'#888', width:3} }]
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    setInfo(d);
  }

  function setInfo(d) {
    info.innerHTML = 'block speed after impact: <b>' + d.v.toFixed(2) + ' m/s</b> · rise height: <b>' +
      d.h.toFixed(2) + ' m</b> · max angle: <b>' + (d.thetaMax * 180 / Math.PI).toFixed(0) + '°</b>' +
      (d.over ? ' · (swings over the top!)' : '');
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Play'; }
  function refresh() {
    stop(); cur = model(); phase = 'hit'; tApproach = 0; theta = 0; omega = 0;
    $('bp-mbval').textContent = $('bp-mb').value;
    $('bp-mpval').textContent = $('bp-mp').value;
    $('bp-vbval').textContent = $('bp-vb').value;
    $('bp-lval').textContent = (+$('bp-l').value).toFixed(1);
    draw(cur, 0, -cur.L * 0.9);      // bullet waiting to the left, at bob height
  }
  ['bp-mb','bp-mp','bp-vb','bp-l'].forEach(function (id) { $(id).addEventListener('input', refresh); });

  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    play.textContent = '⏸ Pause';
    var dt = 1 / 60, startX = -cur.L * 0.9;
    timer = setInterval(function () {
      if (phase === 'hit') {
        tApproach += dt;
        var frac = tApproach / tHit;
        if (frac >= 1) { phase = 'swing'; omega = cur.omega0; theta = 0; draw(cur, 0, null); return; }
        draw(cur, 0, startX * (1 - frac));   // bullet slides in to x=0
      } else {
        // integrate pendulum: theta'' = -(g/L) sin(theta), a few substeps for stability
        for (var s = 0; s < 4; s++) {
          omega += -(g / cur.L) * Math.sin(theta) * (dt / 4);
          theta += omega * (dt / 4);
        }
        draw(cur, theta, null);
      }
    }, dt * 1000);
  });
  refresh();
});
</script>
```
