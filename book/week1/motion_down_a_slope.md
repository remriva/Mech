(w1-motion-down-a-slope)=
# Motion down a slope

A block released on a frictionless incline of angle $\alpha$ accelerates down the slope under
the component of gravity along the surface,

$$
a = g\sin\alpha ,
$$

independent of its mass. Starting from rest a distance $L$ up the slope, it reaches the bottom
after $t = \sqrt{2L / a}$.

```{admonition} Problem
:class: note
An object rests on a slope inclined at $30^\circ$, a distance $L = 100\ \mathrm{m}$ from point
$O$ at the bottom. Neglecting friction, how long does it take to slide down to $O$? How does the
time change on Mars ($g = 3.7\ \mathrm{m/s^2}$), or if the angle is $60^\circ$? Check with the
animation.
```

```{raw} html
<div class="tb-widget" id="sl">
  <div class="tb-controls">
    <label>Slope angle <em>α</em> (°): <b><span id="sl-aval">30</span></b>
      <input id="sl-a" type="range" min="20" max="60" step="1" value="30"></label>
    <label>Gravity <em>g</em> (m/s²): <b><span id="sl-gval">9.80</span></b>
      <input id="sl-g" type="range" min="3" max="15" step="0.1" value="9.8"></label>
  </div>
  <div class="tb-buttons">
    <button id="sl-play">▶ Play</button>
    <span class="tb-info" id="sl-info"></span>
  </div>
  <div class="tb-plot" id="sl-plot"></div>
</div>

<script>
tbLoadPlotly(function (Plotly) {
  var $ = function (id) { return document.getElementById(id); };
  var info = $('sl-info'), plot = $('sl-plot'), play = $('sl-play');
  if (!Plotly) { info.textContent = 'Could not load Plotly.'; return; }
  var L = 100, N = 160, timer = null, cur = null;

  function compute() {
    var alpha = (+$('sl-a').value) * Math.PI / 180, g = +$('sl-g').value;
    var a = g * Math.sin(alpha), tB = Math.sqrt(2 * L / a);
    var t = [], x = [], y = [], v = [];
    for (var i = 0; i <= N; i++) {
      var ti = tB * i / N, s = Math.max(L - 0.5 * a * ti * ti, 0);
      t.push(ti); x.push(s * Math.cos(alpha)); y.push(s * Math.sin(alpha)); v.push(a * ti);
    }
    return { alpha:alpha, g:g, a:a, tB:tB, t:t, x:x, y:y, v:v,
             topX:L * Math.cos(alpha), topY:L * Math.sin(alpha) };
  }

  function draw(idx) {
    var d = compute(); cur = d;
    var bx = idx == null ? d.topX : d.x[idx], by = idx == null ? d.topY : d.y[idx];
    var vNow = idx == null ? 0 : d.v[idx], tNow = idx == null ? 0 : d.t[idx];
    var data = [
      { x:[0, d.topX], y:[0, d.topY], mode:'lines', name:'Slope', line:{color:'#888', width:3} },
      { x:[0, d.topX], y:[0, 0], mode:'lines', name:'Ground', line:{color:'#bbb', width:2, dash:'dot'} },
      { x:[bx], y:[by], mode:'markers', name:'Block',
        marker:{color:'#e4572e', size:16, symbol:'square', line:{color:'#000', width:1}} }
    ];
    var pad = 8;
    var layout = {
      margin:{l:20, r:15, t:10, b:20}, showlegend:false,
      xaxis:{range:[-pad, d.topX + pad], zeroline:false, showticklabels:false, gridcolor:'rgba(128,128,128,0.2)'},
      yaxis:{range:[-pad, d.topY + pad], zeroline:false, showticklabels:false,
             scaleanchor:'x', scaleratio:1, gridcolor:'rgba(128,128,128,0.2)'},
      paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:'#888'},
      annotations:[
        { x:0, y:0, ax:28, ay:-6, text:'O', showarrow:false, font:{size:16} },
        { x:d.topX * 0.28, y:d.topX * 0.28 * Math.tan(d.alpha / 2), showarrow:false,
          text:(+$('sl-a').value) + '°', font:{size:16} }
      ]
    };
    Plotly.react(plot, data, layout, {responsive:true, displayModeBar:false});
    info.innerHTML = 'Time: <b>' + tNow.toFixed(2) + ' s</b> · Speed: <b>' + vNow.toFixed(2) +
      ' m/s</b> · Total descent: <b>' + d.tB.toFixed(2) + ' s</b>';
  }

  function stop() { if (timer) { clearInterval(timer); timer = null; } play.textContent = '▶ Play'; }
  function refresh() {
    stop();
    $('sl-aval').textContent = $('sl-a').value;
    $('sl-gval').textContent = (+$('sl-g').value).toFixed(2);
    draw(null);
  }
  ['sl-a','sl-g'].forEach(function (id) { $(id).addEventListener('input', refresh); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    var i = 0; play.textContent = '⏸ Pause';
    timer = setInterval(function () {
      Plotly.restyle(plot, { x:[[cur.x[i]]], y:[[cur.y[i]]] }, [2]);
      info.innerHTML = 'Time: <b>' + cur.t[i].toFixed(2) + ' s</b> · Speed: <b>' +
        cur.v[i].toFixed(2) + ' m/s</b> · Total descent: <b>' + cur.tB.toFixed(2) + ' s</b>';
      if (i++ >= N) stop();
    }, 1000 / 40);
  });
  refresh();
});
</script>
```
