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
    const ns = 'xormrjjin-debug-jinseo';
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

  // 질문함 (FormSubmit으로 메일 전송)
  const ask = document.getElementById('ask-form');
  if (ask) {
    const msg = document.getElementById('ask-msg');
    ask.addEventListener('submit', e => {
      e.preventDefault();
      const btn = ask.querySelector('button');
      const data = new FormData(ask);
      if (data.get('_honey')) return;
      btn.disabled = true; msg.textContent = '보내는 중입니다.';
      fetch('https://formsubmit.co/ajax/jjin0315@jnu.ac.kr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: '[홈페이지 질문함] 새 질문이 왔습니다',
          _template: 'box',
          이름: data.get('name') || '익명',
          질문: data.get('question'),
        }),
      }).then(r => r.json()).then(r => {
        if (String(r.success) !== 'true') throw new Error();
        ask.reset();
        msg.textContent = '잘 받았습니다. 대체로 답합니다.';
      }).catch(() => {
        msg.textContent = '전송이 안 됐습니다. 잠시 후 다시 해 보시거나 메일로 보내 주세요.';
      }).finally(() => { btn.disabled = false; });
    });
  }
