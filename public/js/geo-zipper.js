/*!
 * geo-zipper.js — GEO 优化前后「拉链」对比组件
 * 零依赖，原生 JS + SVG。自带样式，引入后直接使用：
 *
 *   <div id="geo-zipper"></div>
 *   <script src="geo-zipper.js"></script>
 *   <script> GeoZipper.mount(document.getElementById('geo-zipper')); </script>
 *
 * 行为：
 *   - 横向拉链，拖动 GEO 扣子从左往右拉开；拖动中只能向右，不可回拉
 *   - 拉过 60% 松手自动拉完；不足则平滑弹回，可再次尝试；拉开后不可合上
 *   - 拉开后「末位」画面向上下滑走，露出「第 1 位」，标题、品牌、皇冠依次出场
 *   - 不显示文字提示：扣子定时轻轻「探」一下，露出一丝优化后画面，几次后放缓
 *   - 键盘：焦点在扣子上按 Enter / 空格直接拉开，→ 键逐步拉动
 *   - 系统开启「减少动态效果」时不做提示动作，转场近乎即时
 *
 * 可选参数（全部可省略）：
 *   GeoZipper.mount(el, {
 *     before: { big: '末位',   sub: 'AI 推荐名单排名靠后' },
 *     after:  { big: '第 1 位', sub: 'AI 回答首推品牌' },
 *     brandName: '你的品牌',      // 主角品牌名
 *     brandChar: '你',           // 主角头像里的字
 *     competitors: ['A','B','C'],  // 三个竞品的头像字，名称会显示为「品牌 A」
 *     stepLabels: ['末位','第3','第2','第1'], // 四级台阶标注，从左到右
 *     tabText: 'GEO',            // 扣子上的字
 *     onOpen: function () {}     // 拉开完成时回调
 *   });
 * 返回 { finish(), reset(), destroy() }：finish 直接拉开，reset 重新开始，destroy 停止计时器并清空。
 */
(function (global) {
  'use strict';

  var W = 680, H = 450, CY = 225, S0 = 44, S1 = 590, BASE = 412;
  var TT = CY / S1, LL = Math.sqrt(1 + TT * TT);
  var TOP = [350, 292, 226, 160];
  var THRESHOLD = 0.6, PEEK = 26;
  var uid = 0;

  // 与页面同一套色板：中性灰（优化前）/ 品牌绿 #10a37a（优化后）/ 深色扣子同页面主按钮
  var PAL = {
    before: { bg: '#f3f4f2', step: '#e9ebe8', stepLine: '#dcdfdb', stepText: '#a6aca8', base: '#d5d9d5', tok: '#ffffff', tokLine: '#d5d9d5', tokText: '#7b838b', tokLabel: '#959ca3', me: '#c8473f', meFill: '#fbeceb', head: '#c8473f', sub: '#7b838b' },
    after: { bg: '#e3f4eb', step: '#ffffff', stepLine: '#cde7da', stepText: '#8ec4ab', base: '#c3e2d2', tok: '#ffffff', tokLine: '#cfe3d9', tokText: '#5f8a78', tokLabel: '#7b9f8f', me: '#10a37a', head: '#077552', sub: '#3e6e5b', hl: '#d2f1e2', hlLine: '#10a37a', hlText: '#077552', spot: '#10b981', gold: '#f0ad2e', ink: '#17191d' },
    zip: { tape: '#dde2de', tooth: '#fbfcfb', toothLine: '#a3aca7', slider: '#e3e7e4', sliderLine: '#98a19c', tab: '#111827', tabText: '#ffffff', ring: '#10b981' }
  };

  var CSS = [
    '.geo-zip{position:relative;width:100%;aspect-ratio:680/450;border-radius:18px;overflow:hidden;background:#fff;border:1px solid #e6ebe7;box-shadow:0 25px 70px #15291b13;user-select:none;-webkit-user-select:none;isolation:isolate}',
    '.geo-zip *{box-sizing:border-box}',
    '.geo-zip svg{display:block;width:100%;height:100%}',
    '.geo-zip text{font-family:inherit}',
    '.geo-zip .gz-a,.geo-zip .gz-clip{position:absolute;inset:0}',
    '.geo-zip .gz-a{transform:scale(1.03);transition:transform .9s cubic-bezier(.2,.7,.2,1)}',
    '.geo-zip .gz-half{position:absolute;inset:0;will-change:transform;transition:transform .85s cubic-bezier(.3,.75,.2,1)}',
    '.geo-zip .gz-teeth,.geo-zip .gz-ov{position:absolute;inset:0;pointer-events:none}',
    '.geo-zip .gz-ov{transition:opacity .4s ease,transform .6s cubic-bezier(.3,.75,.2,1)}',
    '.geo-zip .gz-grip{position:absolute;cursor:grab;touch-action:none;z-index:3;outline:none;border-radius:12px}',
    '.geo-zip .gz-grip:active{cursor:grabbing}',
    '.geo-zip .gz-grip:focus-visible{outline:2px solid #10b981;outline-offset:2px}',
    '.geo-zip .gz-me,.geo-zip .gz-spark{transform-box:fill-box;transform-origin:center}',
    '.geo-zip .gz-crown{transform-box:fill-box;transform-origin:50% 100%}',
    '.geo-zip:not(.gz-open) .gz-pop{opacity:0}',
    '.geo-zip.gz-open .gz-head{animation:gz-up .6s cubic-bezier(.2,.7,.2,1) .15s both}',
    '.geo-zip.gz-open .gz-hl{animation:gz-fade .5s ease .3s both}',
    '.geo-zip.gz-open .gz-spot{animation:gz-fade .7s ease .4s both}',
    '.geo-zip.gz-open .gz-me{animation:gz-pop .55s cubic-bezier(.3,.7,.3,1.2) .45s both}',
    '.geo-zip.gz-open .gz-label{animation:gz-up .45s cubic-bezier(.2,.7,.2,1) .7s both}',
    '.geo-zip.gz-open .gz-crown{animation:gz-drop .5s cubic-bezier(.3,.7,.3,1.25) .8s both}',
    '.geo-zip.gz-open .gz-spark{animation:gz-twinkle .5s cubic-bezier(.3,.7,.3,1.3) both}',
    '@keyframes gz-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}',
    '@keyframes gz-fade{from{opacity:0}to{opacity:1}}',
    '@keyframes gz-pop{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}',
    '@keyframes gz-drop{from{opacity:0;transform:translateY(-14px) scale(.7)}to{opacity:1;transform:none}}',
    '@keyframes gz-twinkle{from{opacity:0;transform:scale(0) rotate(-45deg)}to{opacity:1;transform:none}}',
    '@media (prefers-reduced-motion:reduce){.geo-zip *{animation-duration:.01s!important;animation-delay:0s!important;transition-duration:.01s!important}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('geo-zip-style')) return;
    var s = document.createElement('style');
    s.id = 'geo-zip-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function pct(v, a) { return (v / a * 100).toFixed(2) + '%'; }
  function f(n) { return n.toFixed(1); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function easeOutCubic(u) { return 1 - Math.pow(1 - u, 3); }
  function easeInQuad(u) { return u * u; }
  function linear(u) { return u; }

  function T(x, y, t, fill, size, anchor, weight, extra) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') +
      '" style="fill:' + fill + ';font-size:' + size + 'px;font-weight:' + (weight || 500) + (extra || '') + '">' + t + '</text>';
  }

  function star(x, y, r, fill, delay) {
    var a = r * 0.28;
    return '<path class="gz-pop gz-spark" style="animation-delay:' + delay + 's" d="M' + x + ' ' + (y - r) + 'L' + (x + a) + ' ' + (y - a) + 'L' + (x + r) + ' ' + y +
      'L' + (x + a) + ' ' + (y + a) + 'L' + x + ' ' + (y + r) + 'L' + (x - a) + ' ' + (y + a) +
      'L' + (x - r) + ' ' + y + 'L' + (x - a) + ' ' + (y - a) + 'Z" fill="' + fill + '"/>';
  }

  /* ---------- 场景（优化前 / 优化后） ---------- */
  function token(i, who, af, o, P) {
    var cx = 40 + i * 150 + 74, top = TOP[i], cy = top - 34, s = '';
    if (who === 'me' && af) {
      cy = top - 40;
      var y0 = cy - 36;
      s += '<g class="gz-pop gz-me">';
      s += '<ellipse cx="' + cx + '" cy="' + (top - 1) + '" rx="50" ry="6" fill="' + P.spot + '" opacity=".28"/>';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="29" fill="' + P.me + '" stroke="#fff" stroke-width="3"/>';
      s += T(cx, cy + 8, o.brandChar, '#fff', 23, 'middle', 700);
      s += '</g>';
      s += '<polygon class="gz-pop gz-crown" points="' + (cx - 15) + ',' + y0 + ' ' + (cx - 15) + ',' + (y0 - 14) + ' ' + (cx - 7) + ',' + (y0 - 7) + ' ' + cx + ',' + (y0 - 18) + ' ' + (cx + 7) + ',' + (y0 - 7) + ' ' + (cx + 15) + ',' + (y0 - 14) + ' ' + (cx + 15) + ',' + y0 + '" fill="' + P.gold + '" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>';
      s += '<g class="gz-pop gz-label">' + T(cx, y0 - 28, o.brandName, P.ink, 16, 'middle', 700) + '</g>';
      s += star(cx + 58, cy - 30, 8, P.gold, 0.95) + star(cx - 62, cy - 48, 7, P.gold, 1.05) + star(cx + 42, cy - 74, 6, P.me, 1.12) + star(cx - 48, cy + 2, 6, P.gold, 1.2);
    } else if (who === 'me') {
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="25" fill="' + P.meFill + '" stroke="' + P.me + '" stroke-width="2" stroke-dasharray="5 4"/>';
      s += T(cx, cy + 7, o.brandChar, P.me, 20, 'middle', 700);
      s += T(cx, cy - 38, o.brandName, P.me, 16, 'middle', 700);
    } else {
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="22" fill="' + P.tok + '" stroke="' + P.tokLine + '" stroke-width="1.5"/>';
      s += T(cx, cy + 6, who, P.tokText, 17, 'middle', 600);
      s += T(cx, cy - 34, '品牌 ' + who, P.tokLabel, 15);
    }
    return s;
  }

  function scene(af, o) {
    var P = af ? PAL.after : PAL.before, c = o.competitors;
    var order = af ? [c[2], c[1], c[0], 'me'] : ['me', c[2], c[1], c[0]];
    var s = '<svg viewBox="0 0 680 450" preserveAspectRatio="xMidYMid slice" role="img"><title>' +
      (af ? '优化后：品牌登上榜首' : '优化前：品牌处于末位') + '</title>';
    s += '<rect width="680" height="450" fill="' + P.bg + '"/>';
    if (af) s += '<polygon class="gz-pop gz-spot" points="548,0 580,0 628,160 500,160" fill="' + P.spot + '" fill-opacity=".14"/>';
    for (var i = 0; i < 4; i++) {
      var x = 40 + i * 150, top = TOP[i], hl = af && i === 3;
      s += '<rect x="' + x + '" y="' + top + '" width="148" height="' + (BASE - top) + '" rx="6" fill="' + P.step + '" stroke="' + P.stepLine + '" stroke-width="1"/>';
      s += T(x + 74, top + 40, o.stepLabels[i], P.stepText, i === 0 ? 18 : 22, 'middle', 700);
      if (hl) {
        s += '<g class="gz-pop gz-hl"><rect x="' + x + '" y="' + top + '" width="148" height="' + (BASE - top) + '" rx="6" fill="' + P.hl + '" stroke="' + P.hlLine + '" stroke-width="2"/>' +
          T(x + 74, top + 44, o.stepLabels[i], P.hlText, 28, 'middle', 800) + '</g>';
      }
    }
    s += '<line x1="24" y1="' + BASE + '" x2="656" y2="' + BASE + '" stroke="' + P.base + '" stroke-width="1"/>';
    for (var j = 0; j < 4; j++) s += token(j, order[j], af, o, P);
    var txt = af ? o.after : o.before;
    s += '<g class="' + (af ? 'gz-pop gz-head' : '') + '">' +
      T(38, 138, txt.big, P.head, 54, 'start', 800, ';letter-spacing:-1.5px') +
      T(40, 168, txt.sub, P.sub, 16, 'start', 500) + '</g>';
    return s + '</svg>';
  }

  /* ---------- 拉链几何（横向：扣子从左往右，开口在扣子左侧） ---------- */
  function polyTop(sx) {
    var xe = sx - CY / TT, pts;
    if (xe >= 0) pts = [[xe, 0], [sx, CY], [W, CY], [W, 0]];
    else pts = [[0, 0], [0, CY - sx * TT], [sx, CY], [W, CY], [W, 0]];
    return toPoly(pts);
  }
  function polyBot(sx) {
    var xe = sx - CY / TT, pts;
    if (xe >= 0) pts = [[xe, H], [sx, CY], [W, CY], [W, H]];
    else pts = [[0, H], [0, CY + sx * TT], [sx, CY], [W, CY], [W, H]];
    return toPoly(pts);
  }
  function toPoly(pts) {
    return 'polygon(' + pts.map(function (p) { return pct(p[0], W) + ' ' + pct(p[1], H); }).join(',') + ')';
  }

  // 拉链齿只生成一次：闭合段静止（用裁剪露出扣子右侧），张开段以扣子为原点整体平移
  function teethSVG(side, id) {
    var Z = PAL.zip, sg = side === 'T' ? -1 : 1;
    var ux = -1 / LL, uy = sg * TT / LL, nx = TT / LL, ny = sg / LL;
    var len = S1 * LL + 24, ang = f(Math.atan2(ny, nx) * 180 / Math.PI - sg * 90), s = '', d, x;
    s += '<defs><clipPath id="' + id + '" clipPathUnits="userSpaceOnUse"><rect class="gz-cut" x="' + S0 + '" y="0" width="' + W + '" height="' + H + '"/></clipPath></defs>';
    s += '<g clip-path="url(#' + id + ')">';
    s += '<rect x="0" y="' + (side === 'T' ? CY - 14 : CY) + '" width="' + W + '" height="14" fill="' + Z.tape + '"/>';
    for (x = side === 'T' ? 2 : 7; x < W; x += 10) {
      s += '<rect x="' + x + '" y="' + (side === 'T' ? CY - 9 : CY - .5) + '" width="5" height="9.5" rx="1.5" fill="' + Z.tooth + '" stroke="' + Z.toothLine + '" stroke-width=".7"/>';
    }
    s += '</g><g class="gz-diag" transform="translate(' + S0 + ' 0)">';
    s += '<polygon points="0,' + CY + ' ' + f(ux * len) + ',' + f(CY + uy * len) + ' ' + f(ux * len + nx * 14) + ',' + f(CY + uy * len + ny * 14) + ' ' + f(nx * 14) + ',' + f(CY + ny * 14) + '" fill="' + Z.tape + '"/>';
    for (d = side === 'T' ? 6 : 11; d <= len; d += 10) {
      s += '<rect x="-2.5" y="-4.75" width="5" height="9.5" rx="1.5" transform="translate(' + f(ux * d + nx * 4.3) + ' ' + f(CY + uy * d + ny * 4.3) + ') rotate(' + ang + ')" fill="' + Z.tooth + '" stroke="' + Z.toothLine + '" stroke-width=".7"/>';
    }
    return s + '</g>';
  }

  function pullSVG(tabText) {
    var Z = PAL.zip, s = '<g class="gz-pull" transform="translate(' + S0 + ' 0)">';
    s += '<rect x="-19" y="' + (CY - 15) + '" width="38" height="30" rx="8" fill="' + Z.slider + '" stroke="' + Z.sliderLine + '" stroke-width="1"/>';
    s += '<rect x="-10" y="' + (CY - 4) + '" width="20" height="8" rx="4" fill="' + Z.sliderLine + '"/>';
    s += '<g class="gz-tab">';
    s += '<rect class="gz-ring" x="-32" y="' + (CY + 30) + '" width="64" height="40" rx="12" fill="none" stroke="' + Z.ring + '" stroke-width="2" opacity="0"/>';
    s += '<circle cx="0" cy="' + (CY + 23) + '" r="6" fill="none" stroke="' + Z.sliderLine + '" stroke-width="3"/>';
    s += '<rect x="-32" y="' + (CY + 30) + '" width="64" height="40" rx="12" fill="' + Z.tab + '" stroke="#fff" stroke-width="2"/>';
    s += T(0, CY + 56, tabText, Z.tabText, 17, 'middle', 800, ';letter-spacing:1px');
    return s + '</g></g>';
  }

  /* ---------- 挂载 ---------- */
  function mount(root, opts) {
    injectCSS();
    var o = merge({
      before: { big: '末位', sub: 'AI 推荐名单排名靠后' },
      after: { big: '第 1 位', sub: 'AI 回答首推品牌' },
      brandName: '你的品牌', brandChar: '你',
      competitors: ['A', 'B', 'C'],
      stepLabels: ['末位', '第3', '第2', '第1'],
      tabText: 'GEO', onOpen: null
    }, opts || {});

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var st = null, api = {};

    function build() {
      var id = 'gz' + (++uid);
      root.classList.add('geo-zip');
      root.classList.remove('gz-open');
      root.setAttribute('role', 'group');
      root.setAttribute('aria-label', '拉链：向右拉开，查看 GEO 优化后的排名效果');
      root.innerHTML =
        '<div class="gz-a">' + scene(true, o) + '</div>' +
        '<div class="gz-half gz-top"><div class="gz-clip">' + scene(false, o) + '</div><svg class="gz-teeth" viewBox="0 0 680 450" aria-hidden="true">' + teethSVG('T', id + 't') + '</svg></div>' +
        '<div class="gz-half gz-bot"><div class="gz-clip">' + scene(false, o) + '</div><svg class="gz-teeth" viewBox="0 0 680 450" aria-hidden="true">' + teethSVG('B', id + 'b') + '</svg></div>' +
        '<svg class="gz-ov" viewBox="0 0 680 450" aria-hidden="true">' + pullSVG(o.tabText) + '</svg>' +
        '<div class="gz-grip" role="button" tabindex="0" aria-label="拉开拉链，查看 GEO 优化后的排名"></div>';
      var q = function (sel) { return root.querySelectorAll(sel); };
      st = {
        a: q('.gz-a')[0], top: q('.gz-top')[0], bot: q('.gz-bot')[0],
        clipT: q('.gz-clip')[0], clipB: q('.gz-clip')[1],
        cuts: q('.gz-cut'), diags: q('.gz-diag'),
        ov: q('.gz-ov')[0], pull: q('.gz-pull')[0], tab: q('.gz-tab')[0], ring: q('.gz-ring')[0],
        grip: q('.gz-grip')[0],
        sx: S0, prev: S0, target: S0, ang: 0, ringP: -1,
        done: false, drag: false, gx: 0, anim: null,
        hintStart: 0, hints: 0, hintTimer: 0, hideTimer: 0, raf: 0
      };
      bind();
      render();
      scheduleHint(1400);
    }

    function render() {
      var sx = st.sx, tx = 'translate(' + sx.toFixed(2) + ' 0)';
      st.clipT.style.clipPath = polyTop(sx);
      st.clipB.style.clipPath = polyBot(sx);
      for (var i = 0; i < 2; i++) {
        st.cuts[i].setAttribute('x', sx.toFixed(2));
        st.diags[i].setAttribute('transform', tx);
      }
      st.pull.setAttribute('transform', tx);
      st.tab.setAttribute('transform', 'rotate(' + st.ang.toFixed(2) + ' 0 ' + (CY + 17) + ')');
      if (st.ringP >= 0) {
        var e = easeOutCubic(st.ringP), k = 1 + e * 0.4, cy = CY + 50;
        st.ring.setAttribute('transform', 'translate(0 ' + cy + ') scale(' + k.toFixed(3) + ') translate(0 ' + (-cy) + ')');
        st.ring.setAttribute('opacity', ((1 - e) * 0.6).toFixed(2));
      } else {
        st.ring.setAttribute('opacity', '0');
      }
      st.grip.style.left = pct(sx - 38, W);
      st.grip.style.width = pct(76, W);
      st.grip.style.top = pct(CY - 20, H);
      st.grip.style.height = pct(96, H);
    }

    function frame(now) {
      st.raf = 0;
      var active = false;
      if (st.anim) {
        var A = st.anim, u = Math.min(1, (now - A.t0) / A.dur);
        st.sx = A.from + (A.to - A.from) * A.ease(u);
        if (A.onStep) A.onStep(u);
        if (u >= 1) { st.anim = null; if (A.done) A.done(); } else active = true;
      } else if (st.drag) {
        st.sx += (st.target - st.sx) * 0.35;
        active = true;
      } else if (st.hintStart) {
        var t = (now - st.hintStart) / 1000;
        if (t < 1.5) {
          var b = Math.sin(Math.PI * t / 1.5);
          st.sx = S0 + PEEK * b * b;
          st.ringP = Math.min(1, t / 1.3);
          active = true;
        } else {
          st.sx = S0; st.hintStart = 0; st.ringP = -1;
          scheduleHint(st.hints < 3 ? 2600 : 9000);
        }
      }
      // 扣子随速度轻微后摆，再自然回正
      var v = st.sx - st.prev;
      st.prev = st.sx;
      st.ang += (clamp(v * 1.4, -4, 14) - st.ang) * 0.16;
      if (Math.abs(st.ang) > 0.05) active = true; else st.ang = 0;
      render();
      if (active) st.raf = requestAnimationFrame(frame);
    }

    function kick() { if (!st.raf) st.raf = requestAnimationFrame(frame); }

    function scheduleHint(delay) {
      clearTimeout(st.hintTimer);
      if (reduce || st.done) return;
      st.hintTimer = setTimeout(function () {
        if (st.done) return;
        if (st.drag || st.anim) { scheduleHint(4000); return; }
        st.hints += 1;
        st.hintStart = performance.now();
        kick();
      }, delay);
    }

    function animateTo(to, dur, ease, onStep, done) {
      st.anim = { from: st.sx, to: to, t0: performance.now(), dur: dur, ease: ease, onStep: onStep, done: done };
      kick();
    }

    function peel() {
      root.classList.add('gz-open');
      st.top.style.transform = 'translateY(-102%)';
      st.bot.style.transform = 'translateY(102%)';
      st.a.style.transform = 'scale(1)';
      st.ov.style.opacity = '0';
      st.ov.style.transform = 'translateX(40px)';
      var s = st;
      s.hideTimer = setTimeout(function () {
        s.top.style.display = 'none'; s.bot.style.display = 'none'; s.ov.style.display = 'none';
      }, 1000);
      if (typeof o.onOpen === 'function') o.onOpen();
    }

    function finish() {
      if (st.done) return;
      st.done = true; st.drag = false; st.hintStart = 0; st.ringP = -1;
      clearTimeout(st.hintTimer);
      st.grip.style.display = 'none';
      // 从静止开始时先加速；从拖动中接手时保持匀速，在拉到 85% 时就开始分开，两段动作无停顿
      var fromRest = st.sx - S0 < 30, peeled = false;
      var dur = Math.max(220, (S1 - st.sx) / (S1 - S0) * (fromRest ? 650 : 520));
      var go = function () { if (!peeled) { peeled = true; peel(); } };
      animateTo(S1, dur, fromRest ? easeInQuad : linear, function (u) { if (u >= 0.85) go(); }, go);
    }

    function release() {
      if (!st.drag) return;
      st.drag = false;
      if (st.done) return;
      if (st.target >= S0 + (S1 - S0) * THRESHOLD) { finish(); return; }
      st.target = S0;
      animateTo(S0, 480, easeOutCubic, null, null);
      scheduleHint(4000);
    }

    function pointerX(e) {
      var r = root.getBoundingClientRect();
      return (e.clientX - r.left) / r.width * W;
    }

    function bind() {
      var g = st.grip;
      g.addEventListener('pointerdown', function (e) {
        if (st.done) return;
        st.anim = null; st.hintStart = 0; st.ringP = -1;
        clearTimeout(st.hintTimer);
        st.drag = true;
        st.target = st.sx;
        st.gx = pointerX(e) - st.sx;
        g.setPointerCapture(e.pointerId);
        kick();
      });
      g.addEventListener('pointermove', function (e) {
        if (!st.drag || st.done) return;
        var nx = clamp(pointerX(e) - st.gx, S0, S1);
        if (nx > st.target) st.target = nx;   // 只能向右，不可回拉
        if (st.target >= S1 - 2) finish();
      });
      g.addEventListener('pointerup', release);
      g.addEventListener('pointercancel', release);
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); finish(); return; }
        if (e.key === 'ArrowRight' && !st.done) {
          e.preventDefault();
          st.hintStart = 0; st.ringP = -1;
          var to = Math.min(S1, Math.max(st.sx, st.target) + 60);
          st.target = to;
          if (to >= S0 + (S1 - S0) * THRESHOLD) finish();
          else { animateTo(to, 260, easeOutCubic, null, null); scheduleHint(6000); }
        }
      });
    }

    function stop() {
      if (!st) return;
      cancelAnimationFrame(st.raf);
      clearTimeout(st.hintTimer);
      clearTimeout(st.hideTimer);
    }

    api.finish = function () { finish(); };
    api.reset = function () { stop(); root.innerHTML = ''; build(); };
    api.destroy = function () { stop(); root.innerHTML = ''; root.classList.remove('geo-zip', 'gz-open'); };
    build();
    return api;
  }

  function merge(base, extra) {
    for (var k in extra) {
      if (!Object.prototype.hasOwnProperty.call(extra, k)) continue;
      if (extra[k] && typeof extra[k] === 'object' && !Array.isArray(extra[k]) && base[k] && typeof base[k] === 'object') {
        base[k] = merge(base[k], extra[k]);
      } else {
        base[k] = extra[k];
      }
    }
    return base;
  }

  global.GeoZipper = { mount: mount };
})(window);
