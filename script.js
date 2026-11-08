/* ── Typewriter ── */
(function(){
  var el = document.getElementById('typedText');
  if (!el) return;
  var roles = [
    'Sr. Programmer — Oracle Apex',
    'Enterprise Software Developer',
    'PL/SQL & SCM Specialist',
    'Building Scalable Solutions'
  ];
  var ri = 0, ci = 0, del = false;
  function tick(){
    var t = roles[ri];
    ci += del ? -1 : 1;
    el.textContent = t.substring(0, ci);
    var sp = del ? 32 : 62;
    if (!del && ci === t.length){ sp = 2100; del = true; }
    else if (del && ci === 0){ del = false; ri = (ri + 1) % roles.length; sp = 420; }
    setTimeout(tick, sp);
  }
  tick();
})();

/* ── Scroll progress ── */
(function(){
  var bar = document.getElementById('scrollProgress'), ticking = false;
  function update(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? window.scrollY / h * 100 : 0) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking){ ticking = true; requestAnimationFrame(update); }
  }, { passive:true });
})();

/* ── Nav scroll state ── */
(function(){
  var nav = document.getElementById('navbar'), ticking = false;
  function update(){
    nav.classList.toggle('scrolled', window.scrollY > 40);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking){ ticking = true; requestAnimationFrame(update); }
  }, { passive:true });
})();

/* ── Mobile menu ── */
(function(){
  var btn = document.getElementById('menuBtn'), menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  function close(){
    btn.classList.remove('open'); menu.classList.remove('open');
    document.body.style.overflow = '';
  }
  btn.addEventListener('click', function(){
    var open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
})();

/* ── Active nav link ── */
(function(){
  var sections = document.querySelectorAll('section[id], header[id]');
  var links = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  var ticking = false;
  function update(){
    var cur = '';
    sections.forEach(function(s){
      if (window.scrollY >= s.offsetTop - 160) cur = s.id;
    });
    links.forEach(function(a){
      a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
    });
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking){ ticking = true; requestAnimationFrame(update); }
  }, { passive:true });
})();

/* ── Back to top ── */
(function(){
  var btn = document.getElementById('backTop'), ticking = false;
  function update(){
    btn.classList.toggle('show', window.scrollY > 620);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking){ ticking = true; requestAnimationFrame(update); }
  }, { passive:true });
  btn.addEventListener('click', function(){
    window.scrollTo({ top:0, behavior:'smooth' });
  });
})();

/* ── Liquid Glass: cursor refraction (slow lerp) ── */
(function(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.glass').forEach(function(p){
    var tx = 50, ty = 50, cx = 50, cy = 50, raf = null;

    function lerp(){
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;
      p.style.setProperty('--mx', cx + '%');
      p.style.setProperty('--my', cy + '%');
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1){
        raf = requestAnimationFrame(lerp);
      } else {
        raf = null;
      }
    }

    p.addEventListener('mousemove', function(e){
      var r = p.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(lerp);
    });

    p.addEventListener('mouseleave', function(){
      tx = 50; ty = 50;
      if (!raf) raf = requestAnimationFrame(lerp);
    });
  });
})();

/* ── Scroll reveal + counters + meters + sparkle ── */
(function(){
  var els = document.querySelectorAll('.rv, .rv-l, .rv-r, .rv-s');
  if (!('IntersectionObserver' in window)){
    els.forEach(function(el){ el.classList.add('in'); });
    return;
  }

  var sparkColors = ['#B4532A','#D97742','#D9B26A','#4A9B8E','#4A6B7C','#8B5FBF','#C97B5A','#5F6B4E'];

  function burst(x, y, count){
    for (var i = 0; i < count; i++){
      (function(){
        var s = document.createElement('div');
        s.className = 'sparkle';
        var angle = Math.random() * Math.PI * 2;
        var dist = 40 + Math.random() * 90;
        s.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        s.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        s.style.background = sparkColors[Math.floor(Math.random() * sparkColors.length)];
        s.style.width = s.style.height = (5 + Math.random() * 7) + 'px';
        document.body.appendChild(s);
        setTimeout(function(){ s.remove(); }, 1250);
      })();
    }
  }

  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      obs.unobserve(e.target);

      var r = e.target.getBoundingClientRect();
      if (r.top < window.innerHeight && r.top > 0){
        burst(r.left + r.width * 0.5, r.top + 40, 10);
      }

      e.target.querySelectorAll('.skill-meter i').forEach(function(m){
        m.style.width = m.getAttribute('data-width') || '80%';
      });

      e.target.querySelectorAll('[data-target]').forEach(function(n){
        if (n.dataset.done) return;
        n.dataset.done = '1';
        var target = parseInt(n.getAttribute('data-target'), 10), cur = 0;
        var step = Math.max(1, Math.ceil(target / 30));
        var iv = setInterval(function(){
          cur += step;
          if (cur >= target){ cur = target; clearInterval(iv); }
          n.textContent = cur;
        }, 32);
      });
    });
  }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });
  els.forEach(function(el){ obs.observe(el); });
})();

/* ── Colorful particle canvas ── */
(function(){
  var canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var W, H, particles = [];
  var COLORS = [
    'rgba(180,83,42,',  'rgba(217,119,66,', 'rgba(217,178,106,',
    'rgba(74,155,142,', 'rgba(74,107,124,', 'rgba(139,95,191,',
    'rgba(95,107,78,'
  ];

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    var count = Math.min(58, Math.floor(W / 26));
    particles = [];
    for (var i = 0; i < count; i++){
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 1.2 + Math.random() * 3.2,
        vx: (Math.random() - .5) * .32, vy: (Math.random() - .5) * .32,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: .18 + Math.random() * .38,
        pulse: Math.random() * Math.PI * 2,
        pulseSpd: .006 + Math.random() * .014
      });
    }
  }

  var running = true;
  document.addEventListener('visibilitychange', function(){
    running = !document.hidden;
    if (running) requestAnimationFrame(loop);
  });

  function loop(){
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++){
      var p = particles[i];
      p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpd;
      if (p.x < -12) p.x = W + 12;
      if (p.x > W + 12) p.x = -12;
      if (p.y < -12) p.y = H + 12;
      if (p.y > H + 12) p.y = -12;

      var alpha = p.a * (0.62 + 0.38 * Math.sin(p.pulse));
      var rad = p.r * (0.86 + 0.14 * Math.sin(p.pulse * 1.3));

      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 3.4);
      g.addColorStop(0, p.c + alpha + ')');
      g.addColorStop(1, p.c + '0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, rad * 3.4, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = p.c + alpha + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, Math.PI * 2); ctx.fill();
    }

    for (var i = 0; i < particles.length; i++){
      for (var j = i + 1; j < particles.length; j++){
        var a = particles[i], b = particles[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 12000){
          var alpha = (1 - d2 / 12000) * .12;
          ctx.strokeStyle = a.c + alpha + ')';
          ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
})();

/* ── Magnetic hover on buttons (slow lerp) ── */
(function(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.btn').forEach(function(btn){
    var tX = 0, tY = 0, cX = 0, cY = 0, raf = null;

    function lerp(){
      cX += (tX - cX) * 0.07;
      cY += (tY - cY) * 0.07;
      btn.style.transform = 'translate(' + cX + 'px,' + (cY - 3) + 'px)';
      if (Math.abs(tX - cX) > 0.2 || Math.abs(tY - cY) > 0.2){
        raf = requestAnimationFrame(lerp);
      } else {
        raf = null;
      }
    }

    btn.addEventListener('mousemove', function(e){
      var r = btn.getBoundingClientRect();
      tX = (e.clientX - r.left - r.width / 2) * 0.18;
      tY = (e.clientY - r.top - r.height / 2) * 0.18;
      btn.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      btn.style.setProperty('--my', (e.clientY - r.top) + 'px');
      if (!raf) raf = requestAnimationFrame(lerp);
    });

    btn.addEventListener('mouseleave', function(){
      tX = 0; tY = 0;
      if (!raf) raf = requestAnimationFrame(lerp);
    });
  });
})();

/* ── 3D tilt on project cards (slow lerp) ── */
(function(){
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.proj').forEach(function(card){
    var tRX = 0, tRY = 0, cRX = 0, cRY = 0, raf = null;

    function lerp(){
      cRX += (tRX - cRX) * 0.06;
      cRY += (tRY - cRY) * 0.06;
      card.style.transform =
        'translateY(-10px) perspective(1100px) rotateX(' + cRX + 'deg) rotateY(' + cRY + 'deg)';
      if (Math.abs(tRX - cRX) > 0.05 || Math.abs(tRY - cRY) > 0.05){
        raf = requestAnimationFrame(lerp);
      } else {
        raf = null;
      }
    }

    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5;
      var py = (e.clientY - r.top) / r.height - .5;
      tRX = -py * 5;
      tRY = px * 6;
      if (!raf) raf = requestAnimationFrame(lerp);
    });

    card.addEventListener('mouseleave', function(){
      tRX = 0; tRY = 0;
      if (!raf) raf = requestAnimationFrame(lerp);
    });
  });
})();

/* ── Contact form ── */
(function(){
  var form = document.getElementById('contactForm'), note = document.getElementById('formNote');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var n = document.getElementById('fName').value.trim(),
        m = document.getElementById('fEmail').value.trim(),
        t = document.getElementById('fMsg').value.trim();
    if (!n || !m || !t){
      note.textContent = 'Please fill in name, email, and message.';
      note.style.color = '#B4532A';
      return;
    }
    note.textContent = 'Thank you, ' + n + '! Please email me directly at sh.sujon4x@gmail.com';
    note.style.color = '#5F6B4E';
    form.reset();
  });
})();
