  document.documentElement.classList.add('js');

  // 광주 현재 시각
  const clock = document.getElementById('clock');
  const tick = () => clock.textContent = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit' });
  tick(); setInterval(tick, 10000);

  // 스크롤 시 부드럽게 등장
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  // 방문자 수 (한 번 방문에 한 번만 셉니다)
  const visits = document.getElementById('visits');
  if (visits) {
    const api = 'https://abacus.jasoncameron.dev';
    const ns = 'xormrjjin-debug-jinseo-v2';
    const day = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(/-/g, '');
    let counted = false;
    try { counted = sessionStorage.getItem('counted') === '1'; } catch (e) {}
    const op = counted ? 'get' : 'hit';
    const count = key => fetch(`${api}/${op}/${ns}/${key}`)
      .then(r => r.ok ? r.json() : { value: 0 }).then(d => d.value || 0).catch(() => null);
    Promise.all([count('d' + day), count('total')]).then(([today, total]) => {
      if (total === null) return;
      visits.textContent = `Today ${today || 0} · Total ${total}`;
      try { sessionStorage.setItem('counted', '1'); } catch (e) {}
    });
  }

  // 사진첩 크게 보기
  const lb = document.getElementById('lightbox');
  if (lb) {
    const img = lb.querySelector('img'), cap = lb.querySelector('figcaption');
    const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); };
    document.querySelectorAll('.shot button').forEach(b => b.addEventListener('click', () => {
      img.src = b.dataset.src;
      cap.textContent = b.parentElement.querySelector('figcaption')?.textContent || '';
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    }));
    lb.addEventListener('click', e => { if (e.target !== img) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // 랜덤 TMI
  const tmiBtn = document.getElementById('tmi-btn');
  if (tmiBtn) {
    const tmis = [
      '사람 괴롭히기를 잘합니다. 친한 사람한테만 합니다.',
      '요즘은 여행에 빠져 있습니다. 다녀오면 바로 다음 갈 곳을 찾습니다.',
      '커피 중독입니다. 사실 다들 압니다.',
      '알람은 다섯 개 이상 맞춥니다. 첫 번째 알람에 일어난 적은 없습니다.',
      'ESTJ입니다. 몇 번을 검사해도 안 바뀝니다.',
      'ESTJ인데 계획보다 즉흥을 고릅니다. 저도 이유는 모릅니다.',
      '별명은 벌꿀오소리입니다. 성격이 비슷해서 생겼습니다.',
      '이름 뜻은 "진리를 펼쳐라"입니다. 명령형이라 조금 부담스럽습니다.',
      '고향은 익산입니다. 사투리는 안 쓴다고 생각합니다.',
      'A형입니다. 급하게 A형 피가 필요하면 연락 주세요.',
      '주량은 3병입니다. 알아서 믿으십쇼.',
      '취하면 집에 갑니다. 집 주소는 안 까먹습니다.',
      '영화는 거의 안 봅니다. 그냥 손이 잘 안 갑니다.',
      '먹는 것만 먹습니다. 메뉴 고민할 시간이 줄어듭니다.',
      '봄과 가을을 좋아합니다. 선선해서요.',
      '여름보다는 겨울이 낫습니다.',
      '전화도 문자도 싫습니다. 그래도 답장은 빠릅니다.',
      '강아지도 고양이도 무섭습니다. 귀여운 건 압니다.',
      '짬뽕보다 짜장입니다.',
      '탕수육은 찍먹입니다.',
      '산보다 바다입니다.',
      '집보다 밖입니다.',
      '약속 시간보다 5분 일찍 도착합니다. 20분까지는 기다려 드립니다.',
      '테니스를 배우고 싶습니다. 장비는 아직 안 샀습니다.',
      '스트레스를 받으면 티가 납니다. 숨기려고 해 봤는데 잘 안 됐습니다.',
      '자면 회복됩니다. 많이 자면 완전히 회복됩니다.',
      '밥은 천천히 먹습니다.',
      '목표는 적당히 벌고 재밌게 살기입니다.',
    ];
    const no = document.getElementById('tmi-no'), text = document.getElementById('tmi-text');
    document.getElementById('tmi-total').textContent = String(tmis.length).padStart(2, '0');
    let order = [], pos = 0;
    const shuffle = () => { order = tmis.map((_, i) => i).sort(() => Math.random() - .5); pos = 0; };
    const show = () => {
      if (pos >= order.length) shuffle();
      const i = order[pos++];
      text.classList.add('fade');
      setTimeout(() => {
        text.textContent = tmis[i];
        no.textContent = String(i + 1).padStart(2, '0');
        text.classList.remove('fade');
      }, 200);
    };
    shuffle(); show();
    tmiBtn.addEventListener('click', show);
  }

  // 챕터 탭
  const tabBtns = document.querySelectorAll('.tabs button');
  const openTab = id => {
    tabBtns.forEach(b => {
      const on = b.dataset.tab === id;
      b.setAttribute('aria-selected', on);
      document.getElementById('p-' + b.dataset.tab).hidden = !on;
    });
  };
  tabBtns.forEach(b => b.addEventListener('click', () => openTab(b.dataset.tab)));
  document.querySelectorAll('a[data-tab]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    openTab(a.dataset.tab);
    const box = document.getElementById('about');
    if (box.getBoundingClientRect().top < 0 || window.innerWidth <= 820) box.scrollIntoView();
  }));
  const fromHash = location.hash.slice(1);
  if (document.getElementById('p-' + fromHash)) { openTab(fromHash); }

  // 질문함 (구글 폼으로 전송)
  // 구글 폼을 연결하면 아래 세 값을 채웁니다.
  const GFORM = {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLScLmgt32PxkWkS45eZfbR4Ofhi3tz7xVRiOgccMDhrDgmYOjw/formResponse',
    question: 'entry.2147061591',
    name: 'entry.1213908891',
  };
  const ask = document.getElementById('ask-form');
  if (ask) {
    const msg = document.getElementById('ask-msg');
    const btn = ask.querySelector('button');
    if (!GFORM.action) {
      btn.disabled = true;
      msg.textContent = '질문함은 준비 중입니다. 급하면 메일로 보내 주세요.';
    }
    ask.addEventListener('submit', e => {
      e.preventDefault();
      if (!GFORM.action) return;
      const data = new FormData(ask);
      const body = new URLSearchParams();
      body.append(GFORM.question, data.get('question'));
      if (GFORM.name) body.append(GFORM.name, data.get('name') || '익명');
      btn.disabled = true; msg.textContent = '보내는 중입니다.';
      fetch(GFORM.action, { method: 'POST', mode: 'no-cors', body })
        .then(() => { ask.reset(); msg.textContent = '잘 받았습니다. 대체로 답합니다.'; })
        .catch(() => { msg.textContent = '전송이 안 됐습니다. 잠시 후 다시 해 보시거나 메일로 보내 주세요.'; })
        .finally(() => { btn.disabled = false; });
    });
  }

  // ================= Play =================
  const kst = () => {
    const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(new Date());
    const h = +p.find(x => x.type === 'hour').value % 24, m = +p.find(x => x.type === 'minute').value;
    return { h, m, mins: h * 60 + m, label: String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') };
  };
  const shared = (op, key) => fetch(`https://abacus.jasoncameron.dev/${op}/xormrjjin-debug-jinseo-v2/${key}`)
    .then(r => r.ok ? r.json() : { value: 0 }).then(d => d.value || 0).catch(() => null);
  const pick = a => a[Math.floor(Math.random() * a.length)];

  // 1. 지금 진서는? (A Day 기준)
  const nowText = document.getElementById('now-text');
  if (nowText) {
    const plan = [
      [0, '아까 그 생각을 아직 하는 중입니다. 대체로 내일 해도 되는 일입니다.'],
      [120, '자는 중입니다. 많이 자면 12시간도 잡니다.'],
      [440, '첫 번째 알람을 듣는 중입니다. 듣기만 합니다.'],
      [460, '이제 막 일어났습니다. 알람 다섯 개를 다 듣고 나서요.'],
      [540, '하루를 시작하는 중입니다. 커피부터 마십니다.'],
      [720, '점심 메뉴를 고민하는 중입니다. 결론은 늘 비슷합니다.'],
      [780, '먹던 거 먹는 중입니다. 천천히 먹습니다.'],
      [900, '커피를 하나 더 마시는 중입니다. 효과는 미미합니다.'],
      [960, '오후를 버티는 중입니다. 대체로 버팁니다.'],
      [1080, '저녁을 보내는 중입니다. 하루 중 제일 자유로운 시간입니다.'],
      [1380, '이제 자야지, 하고 휴대폰을 보는 중입니다.'],
    ];
    const tick = () => {
      const t = kst();
      let msg = plan[0][1];
      for (const [from, text] of plan) if (t.mins >= from) msg = text;
      nowText.textContent = msg;
      document.getElementById('now-time').textContent = t.label;
    };
    tick(); setInterval(tick, 30000);
  }

  // 2. 다 같이 키우는 벌꿀오소리
  const bdBtn = document.getElementById('bd-btn');
  if (bdBtn) {
    const moods = ['배고픔', '예민함', '사나움', '만족함', '졸림'];
    const lines = ['먹었습니다. 고맙다는 말은 안 합니다.', '먹었습니다. 더 달라는 눈빛입니다.', '꿀만 골라 먹었습니다.',
      '먹다가 물 뻔했습니다. 친해졌다는 뜻입니다.', '먹고 바로 잡니다.', '먹었습니다. 대체로 괜찮은 맛이었습니다.'];
    const pet = document.getElementById('bd-pet');
    const render = n => {
      if (n === null) { document.getElementById('bd-count').textContent = '-'; return; }
      const lv = Math.floor(Math.sqrt(n / 2)) + 1;
      document.getElementById('bd-count').textContent = n.toLocaleString();
      document.getElementById('bd-lv').textContent = lv;
      document.getElementById('bd-mood').textContent = moods[n % moods.length];
      pet.style.fontSize = Math.min(44 + lv * 6, 130) + 'px';
    };
    shared('get', 'badger').then(render);
    bdBtn.addEventListener('click', () => {
      bdBtn.disabled = true;
      shared('hit', 'badger').then(n => {
        render(n);
        document.getElementById('bd-msg').textContent = n === null ? '지금은 밥을 못 받습니다. 잠시 후에 다시 주세요.' : pick(lines);
        pet.classList.add('bump'); setTimeout(() => pet.classList.remove('bump'), 160);
        setTimeout(() => { bdBtn.disabled = false; }, 400);
      });
    });
  }

  // 5. 카페인 충전 게이지 (매일 0%에서 시작)
  const cfBtn = document.getElementById('cf-btn');
  if (cfBtn) {
    const key = 'coffee-d' + new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).replace(/-/g, '');
    const render = (n, clicked) => {
      if (n === null) { document.getElementById('cf-pct').textContent = '-'; return; }
      const pct = n * 5;
      document.getElementById('cf-pct').textContent = pct;
      document.getElementById('cf-fill').style.width = Math.min(pct, 100) + '%';
      const msg = pct >= 150 ? '과충전 상태입니다. 그래도 주시면 마십니다.'
        : pct >= 100 ? '오늘은 충분합니다. 내일 다시 비워집니다.'
        : pct >= 50 ? '절반 넘었습니다. 말이 조금 많아지기 시작합니다.'
        : clicked ? '한 모금 마셨습니다. 효과는 미미합니다.'
        : '한 번 누를 때마다 한 모금씩 채워집니다. 매일 밤 비워집니다.';
      document.getElementById('cf-msg').textContent = msg;
    };
    shared('get', key).then(n => render(n, false));
    cfBtn.addEventListener('click', () => {
      cfBtn.disabled = true;
      shared('hit', key).then(n => { render(n, true); setTimeout(() => { cfBtn.disabled = false; }, 400); });
    });
  }

  // 4. 진서 깨우기
  const wkBtn = document.getElementById('wk-btn');
  if (wkBtn) {
    const say = ['……', '5분만…', '진짜 5분만…', '알람 하나 남았습니다. 아직 괜찮습니다.', '일어났습니다. 정확히 20분 지났습니다.'];
    let step = 0, naps = 0;
    const text = document.getElementById('wk-text'), dots = document.querySelectorAll('#wk-dots i');
    const draw = () => {
      dots.forEach((d, i) => d.classList.toggle('on', i < step));
      document.getElementById('wk-step').textContent = `알람 ${step} / 5`;
    };
    wkBtn.addEventListener('click', () => {
      if (step >= 5) {               // 다시 재우기
        step = 0; naps++;
        if (naps >= 3) {
          text.textContent = '12시간 모드에 들어갔습니다. 오늘은 일어나지 않습니다.';
          wkBtn.textContent = '포기하기';
          step = -1; draw(); return;
        }
        text.textContent = '다시 잡니다. 금방 잡니다.';
        wkBtn.textContent = '알람 울리기 ⏰'; draw(); return;
      }
      if (step === -1) {             // 12시간 모드에서 포기
        step = 0; naps = 0;
        text.textContent = '진서가 자고 있습니다. 깨워 보세요.';
        wkBtn.textContent = '알람 울리기 ⏰'; draw(); return;
      }
      text.textContent = say[step];
      step++; draw();
      if (step === 5) wkBtn.textContent = '다시 재우기 💤';
    });
  }

  // 3. 진서 말투 번역기
  const trForm = document.getElementById('tr-form');
  if (trForm) {
    const dict = [
      ['배고파', '배가 고픕니다'], ['배불러', '배가 부릅니다'], ['졸려', '졸립니다'], ['피곤해', '피곤합니다'],
      ['심심해', '심심합니다'], ['귀찮아', '귀찮습니다'], ['힘들어', '힘듭니다'], ['재밌어', '재밌습니다'],
      ['재미없어', '재미없습니다'], ['좋아', '좋습니다'], ['싫어', '싫습니다'], ['몰라', '모르겠습니다'],
      ['괜찮아', '괜찮습니다'], ['보고 싶어', '보고 싶습니다'], ['보고싶어', '보고 싶습니다'], ['사랑해', '사랑합니다'],
      ['미안해', '미안합니다'], ['고마워', '고맙습니다'], ['추워', '춥습니다'], ['더워', '덥습니다'],
      ['자고 싶어', '자고 싶습니다'], ['집 가고 싶어', '집에 가고 싶습니다'], ['집가고싶어', '집에 가고 싶습니다'],
      ['가자', '갑시다'], ['먹자', '먹읍시다'], ['놀자', '놉시다'], ['뭐해', '뭐 하십니까'], ['어디야', '어디십니까'],
      ['대박', '놀랍습니다'], ['헐', '놀랍습니다'], ['짜증나', '짜증이 납니다'], ['행복해', '행복합니다'],
    ];
    const tails = ['대체로 그렇습니다.', '이유는 딱히 없습니다.', '알아서 믿으십쇼.', '본인은 괜찮다고 합니다.',
      '미리 사과드립니다.', '사실 다들 압니다.', '아마도요.', '효과는 미미합니다.'];
    const jong = ch => { const c = (ch || '').charCodeAt(0) - 0xAC00; return c >= 0 && c < 11172 ? c % 28 : 0; };
    const translate = raw => {
      let s = raw.trim();
      if (!s) return '할 말이 없습니다. 그것도 괜찮습니다.';
      const laugh = /ㅋ|ㅎㅎ/.test(s), cry = /ㅠ|ㅜ/.test(s), q = /\?$/.test(s.replace(/[ㅋㅎㅠㅜ~!.\s]+$/, ''));
      s = s.replace(/[ㅋㅎㅠㅜ]+/g, '').replace(/[~!?.…\s]+$/g, '').trim();
      let hit = false;
      for (const [a, b] of dict) {
        if (s.endsWith(a)) { s = s.slice(0, -a.length) + b; hit = true; break; }
      }
      if (!hit) {
        if (/해$/.test(s)) { s = s.slice(0, -1) + '합니다'; hit = true; }
        else if (/(이)?야$/.test(s)) { s = s.replace(/(이)?야$/, '입니다'); hit = true; }
        else if (/다$/.test(s)) {
          hit = true;
          if (jong(s[s.length - 2]) === 20) s = s.slice(0, -1) + '습니다';   // 끝났다 → 끝났습니다
        }
      }
      if (!s) s = '그렇습니다';
      let out = s + (q ? '?' : '.');
      if (!hit && !q) out = s + (jong(s[s.length - 1]) > 0 ? ', 이라고 합니다.' : ', 라고 합니다.');
      out += ' ' + (laugh ? '웃기긴 합니다.' : cry ? '조금 슬프긴 합니다.' : pick(tails));
      return out;
    };
    trForm.addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('tr-out').textContent = translate(document.getElementById('tr-in').value);
    });
  }
