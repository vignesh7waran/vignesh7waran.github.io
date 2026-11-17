(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  function updateThemeLabel() {
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    updateThemeLabel();
  });
  updateThemeLabel();

  /* ---------- Name intro: hi -> i'm vigneshwaran s -> VIGNESHWARAN S ---------- */
  var screen = document.getElementById('screen');
  var typed = document.getElementById('typed');
  var nameEl = document.getElementById('name');

  function intro() {
    var at = function (ms, fn) { setTimeout(fn, ms); };
    var typeOut = function (text, start, speed) {
      for (var i = 1; i <= text.length; i++) {
        (function (n) { at(start + n * speed, function () { typed.textContent = text.slice(0, n); }); })(i);
      }
      return start + text.length * speed;
    };
    nameEl.hidden = true;
    screen.hidden = false;
    typed.textContent = '';

    var t = typeOut('hi', 700, 220);
    t += 2000;                                   // "hi" stays for 2 seconds
    at(t, function () { typed.textContent = ''; });
    t = typeOut("i'm vigneshwaran s", t + 600, 110);
    t += 2600;
    at(t, function () { screen.hidden = true; });
    at(t + 500, function () { nameEl.hidden = false; nameEl.classList.add('reveal'); });
  }
  if (!reduced) intro();

  /* ---------- v-mini: follows the mouse slowly ---------- */
  var page = document.getElementById('page');
  var bot = document.getElementById('bot');
  var tip = document.getElementById('tip');
  var chat = document.getElementById('chat');
  var chatOpen = false;
  var pos = null;
  var last = 0;

  function placeBot() {
    if (chatOpen || !pos) {
      bot.style.left = 'calc(100% - 68px)';
      bot.style.top = 'calc(100% - 76px)';
      tip.classList.remove('left');
    } else {
      bot.style.left = pos.x + 'px';
      bot.style.top = pos.y + 'px';
      tip.classList.toggle('left', pos.x < 280);
    }
  }

  page.addEventListener('mousemove', function (e) {
    if (chatOpen || reduced) return;
    var now = Date.now();
    if (now - last < 200) return;
    last = now;
    var r = page.getBoundingClientRect();
    var mx = e.clientX - r.left;
    var my = e.clientY - r.top;
    if (pos) {
      var dx = mx - (pos.x + 22), dy = my - (pos.y + 22);
      if (Math.sqrt(dx * dx + dy * dy) < 90) return;  // stop when the visitor comes close, so it can be clicked
    }
    pos = {
      x: Math.min(Math.max(mx + 36, 8), r.width - 52),
      y: Math.min(Math.max(my + 28, 8), r.height - 52)
    };
    placeBot();
  });

  /* ---------- Hint bubble ---------- */
  var tips = ["psst, I'm v-mini, a tiny model", 'click me, I know all about V', 'ask me what V is building', 'I answer in under a second'];
  var tipIndex = 0;
  setInterval(function () {
    tipIndex = (tipIndex + 1) % tips.length;
    tip.textContent = tips[tipIndex];
    tip.style.animation = 'none';
    void tip.offsetWidth;
    tip.style.animation = '';
  }, 4000);

  /* ---------- Chat ---------- */
  var body = document.getElementById('chat-body');
  var qsBox = document.getElementById('chat-qs');
  var botBtn = document.getElementById('bot-btn');
  var streamTimer = null;

  var questions = [
    { label: 'Who is V?', reply: 'V is Vigneshwaran S, a 3rd-year B.Tech IT student at Kongu Engineering College who builds LLM-powered apps.' },
    { label: "What's V's skill stack?", reply: 'Python, Java and SQL. LLM apps, RAG and AI agents with Ollama. FastAPI, PostgreSQL, Docker and n8n. All on Fedora Linux.' },
    { label: 'What has V built?', reply: 'Smart Grid GenAI, which turns plain-English questions into SQL, Sovereign AI, a private on-premise agent workbench, and CLUE, an AI weekly planner.' },
    { label: 'Is V open to work or internships?', reply: 'Yes. V is looking for AI/ML and LLM internships for 2027.' },
    { label: 'How do I contact V?', reply: 'Email: ad "@" vigneshwarans "dot" me. LinkedIn works too.' }
  ];

  function addMsg(text, who) {
    var d = document.createElement('div');
    d.className = 'msg ' + (who === 'you' ? 'you' : 'bot-msg mono');
    d.textContent = text;
    body.appendChild(d);
    while (body.children.length > 4) body.removeChild(body.firstChild);
    return d;
  }

  function ask(q) {
    if (streamTimer) clearInterval(streamTimer);
    addMsg(q.label, 'you');
    var out = addMsg('…', 'bot');
    if (reduced) { out.textContent = q.reply; return; }
    var words = q.reply.split(' ');
    var n = 0;
    streamTimer = setInterval(function () {
      n += 1;
      out.textContent = words.slice(0, n).join(' ');
      if (n >= words.length) { clearInterval(streamTimer); streamTimer = null; }
    }, 60);
  }

  addMsg("Hi, I'm v-mini. Pick a question.", 'bot');
  questions.forEach(function (q) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = q.label;
    b.addEventListener('click', function () { ask(q); });
    qsBox.appendChild(b);
  });

  function toggleChat() {
    chatOpen = !chatOpen;
    chat.hidden = !chatOpen;
    tip.hidden = chatOpen;
    botBtn.setAttribute('aria-label', chatOpen ? 'Close v-mini chat' : 'Open v-mini chat, ask me about V');
    placeBot();
  }
  botBtn.addEventListener('click', toggleChat);
  document.getElementById('chat-close').addEventListener('click', toggleChat);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && chatOpen) toggleChat(); });
})();
