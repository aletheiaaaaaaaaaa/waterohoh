document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // ★ 事件題庫
    //
    //  imgStyle：{ width, top, left, right, bottom }
    //  yes / no / ignore：三種結果
    //    v      : 固定水量變化 (%)
    //    vRand  : 隨機水量變化 [min, max]
    //    s      : 固定淤積變化
    //    sRand  : 隨機淤積變化 [min, max]
    //    ignore : 「不處理（超時）」套用的結果，留空則隨機選 yes 或 no
    // ============================================================
    const EVENTS = [

        // ── w1 水庫 ────────────────────────────────────────────
        {
            scene: 'w1',
            image: 'pic/man/m2.png',
            imgStyle: { width: '160px', top: '45%', left: '30%' },
            question: '這個人在開挖土機在幹嘛呢？要阻止他嗎？',
            yes:    { text: '工人覺得有點疑惑還是收工了，清淤工程已停止。',   v: 0, s: 0, vRand: null,     sRand: null },
            no:     { text: '原來是在進行清理水庫淤泥的工程，工程繼續。',     v: 0, s: 0, vRand: [-8,-3],  sRand: null },
            ignore: { text: '工程車自行離開了，情況沒有改變。',               v: 0, s: 0, vRand: null,     sRand: null },
        },
        {
            scene: 'w1',
            image: 'pic/man/m3.png',
            imgStyle: { width: '200px', top: '30%', left: '55%' },
            question: '水表面有一大塊綠色的東西在漂，要處理嗎？',
            yes:    { text: '原來是藻類，啟動除藻，水質維持正常。',            v: 0, s: 0, vRand: null,      sRand: null },
            no:     { text: '藻華大量繁殖，水庫優養化，部分水源無法使用。',    v: 0, s: 0, vRand: [-30,-15], sRand: [3,6] },
            ignore: null,   // null = 超時隨機套用 yes 或 no
        },
        {
            scene: 'w1',
            image: 'pic/man/m1.png',
            imgStyle: { width: '120px', top: '55%', left: '60%' },
            question: '有人在釣魚呢，要阻止他嗎？',
            yes:    { text: '釣客被依法取締，水庫並非釣魚場所。',              v: 0, s: 0, vRand: null,    sRand: null },
            no:     { text: '釣客繼續釣魚，魚餌、鉛錘沉入水底污染水質。',      v: 0, s: 0, vRand: [-3,-1], sRand: null },
            ignore: null,
        },

        // ── fo 工廠 ────────────────────────────────────────────
        {
            scene: 'fo',
            image: 'pic/man/m8.png',
            imgStyle: { width: '180px', top: '50%', left: '40%' },
            question: '河面上有很多翻肚的魚，要處理嗎？',
            yes:    { text: '工廠洩漏的污染源已查明並處理。',                  v: 0, s: 0, vRand: [-10,-5],  sRand: null },
            no:     { text: '污染持續擴散，大範圍水源受影響。',                v: 0, s: 0, vRand: [-50,-25], sRand: [5,10] },
            ignore: null,
        },
        {
            scene: 'fo',
            image: 'pic/man/m4.png',
            imgStyle: { width: '140px', top: '60%', left: '50%' },
            question: '有幾個看著冒出奇怪液體的桶，要處理嗎？',
            yes:    { text: '確認是違法棄置有毒廢液，妥善清除。',              v: 0, s: 0, vRand: null,     sRand: null },
            no:     { text: '桶子腐蝕後液體滲入土壤與地下水。',               v: 0, s: 0, vRand: [-18,-8], sRand: null },
            ignore: null,
        },

        // ── t1 農田 ────────────────────────────────────────────
        {
            scene: 't1',
            image: 'pic/man/m6.png',
            imgStyle: { width: '150px', top: '55%', left: '35%' },
            question: '有人在水渠用水管往田裡接水，要阻止他嗎？',
            yes:    { text: '確認是盜引灌溉水，制止了違規行為。',              v: 0, s: 0, vRand: [-5,-2],  sRand: null },
            no:     { text: '非法抽水沒被阻止，被抽得更多了。',               v: 0, s: 0, vRand: [-12,-5], sRand: null },
            ignore: null,
        },
        {
            scene: 't1',
            image: 'pic/man/m7.png',
            imgStyle: { width: '130px', top: '65%', left: '45%' },
            question: '有一空桶子被丟在溝渠旁，要處理嗎？',
            yes:    { text: '確認是農藥空桶違法棄置，妥善清運並未污染。',      v: 0, s: 0, vRand: null,     sRand: null },
            no:     { text: '殘留農藥隨雨水滲漏進水渠與土地中。',             v: 0, s: 0, vRand: [-10,-4], sRand: null },
            ignore: null,
        },

        // ── s1 街道 ────────────────────────────────────────────
        {
            scene: 's1',
            image: 'pic/man/m8.png',
            imgStyle: { width: '110px', top: '50%', left: '55%' },
            question: '街道上有個消防栓一直在流出水呢，要處理嗎？',
            yes:    { text: '確認消防栓未確實關閉，已做處理。',                v: 0, s: 0, vRand: [-3,-1],  sRand: null },
            no:     { text: '持續漏水，大量乾淨水源白白流失。',               v: 0, s: 0, vRand: [-12,-5], sRand: [2,4] },
            ignore: null,
        },
    ];
    // ============================================================
    // ★ 題庫結束
    // ============================================================

    // ── 難易度設定 ──────────────────────────────────────────────
    // maxPerWindow : 每 30 秒最多同時存在的事件數
    // eventLife    : 事件圖片存在秒數
    const DIFFICULTY = {
        easy:   { maxPerWindow: 2, eventLife: 15 },
        normal: { maxPerWindow: 3, eventLife: 15 },
        hard:   { maxPerWindow: 4, eventLife: 15 },
    };
    let currentDifficulty = 'normal';

    // ── Screens ──────────────────────────────────────────────────
    const layer1 = document.getElementById('layer1');
    const layer2 = document.getElementById('layer2');
    const layer3 = document.getElementById('layer3');
    const layer4 = document.getElementById('layer4');
    const layer5 = document.getElementById('layer5');

    const btnStart       = document.getElementById('btn-start');
    const btnBackToTitle = document.getElementById('btn-back-to-title');
    const gameBg         = document.getElementById('game-bg');

    // Slideshow
    const mainBgSlideshow = document.getElementById('main-bg-slideshow');
    const bgSlides = document.querySelectorAll('.bg-slide');
    let currentSlideIndex = 0;
    setInterval(() => {
        bgSlides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % bgSlides.length;
        bgSlides[currentSlideIndex].classList.add('active');
    }, 10000);

    const backgrounds = ['w1', 'fo', 't1', 'l1', 's1'];
    let currentBgIndex = 0;

    // ── Timer ────────────────────────────────────────────────────
    let gameTimerInterval = null;
    let timeLeft = 360;

    // ── Game stats ───────────────────────────────────────────────
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let gameStats = {};

    function updateStatsUI() {
        const elPct    = document.getElementById('info-v-pct');
        const elSilt   = document.getElementById('info-silt');
        const elRain   = document.getElementById('info-rain');
        const elUsage  = document.getElementById('info-usage');
        const barSilt  = document.getElementById('info-bar-silt');
        const barWater = document.getElementById('info-bar-water');

        if (elPct)   elPct.textContent   = gameStats.vPct + '%';
        if (elSilt)  elSilt.textContent  = gameStats.silt.toLocaleString();
        if (elRain)  elRain.textContent  = gameStats.rain;
        if (elUsage) elUsage.textContent = gameStats.usage.toLocaleString();

        const siltPct = (gameStats.silt / gameStats.totalCap) * 100;
        if (barSilt)  barSilt.style.width  = siltPct + '%';
        if (barWater) barWater.style.width = gameStats.vPct + '%';
    }

    function initGameStats() {
        gameStats = {
            vPct: randInt(30, 65), totalCap: 40000,
            silt: randInt(500, 1500), rain: randInt(100, 400), usage: randInt(400, 600),
        };
        updateStatsUI();
    }

    // 套用數值變化，並顯示左上角增減提示
    function applyStatDelta(choice) {
        let dv = choice.v || 0;
        let ds = choice.s || 0;
        if (choice.vRand) dv += randInt(choice.vRand[0], choice.vRand[1]);
        if (choice.sRand) ds += randInt(choice.sRand[0], choice.sRand[1]);

        gameStats.vPct = Math.max(0, Math.min(100, gameStats.vPct + dv));
        gameStats.silt = Math.max(0, gameStats.silt + ds * 100);
        updateStatsUI();

        // 顯示左上角 +n% / -n% 提示
        if (dv !== 0) showDeltaBadge(dv);

        return { dv, ds };
    }

    // ── 左上角 +n% 增減提示 ─────────────────────────────────────
    let deltaBadgeTimeout = null;

    function showDeltaBadge(dv) {
        const badge = document.getElementById('info-delta-badge');
        if (!badge) return;

        clearTimeout(deltaBadgeTimeout);
        badge.textContent = (dv > 0 ? '+' : '') + dv + '%';
        badge.className   = 'info-delta-badge ' + (dv > 0 ? 'positive' : 'negative') + ' show';

        deltaBadgeTimeout = setTimeout(() => {
            badge.classList.remove('show');
        }, 2500);
    }

    // ── Navigation ───────────────────────────────────────────────
    function showScreen(screenToShow) {
        [layer1, layer2, layer3, layer4, layer5].forEach(s => {
            if (s) s.classList.remove('active');
        });
        if (screenToShow) screenToShow.classList.add('active');

        if (screenToShow === layer1) {
            if (mainBgSlideshow) mainBgSlideshow.style.display = 'block';
            document.body.style.backgroundImage = 'none';
            stopGameTimer(); stopEventScheduler(); clearAllEventImages();
        } else if (screenToShow === layer2) {
            if (mainBgSlideshow) mainBgSlideshow.style.display = 'none';
            document.body.style.backgroundImage = "url('pic/sur/chooseb.png')";
            const btnInto = document.getElementById('btn-into');
            if (btnInto) btnInto.style.display = 'none';
            const mapIsland = document.getElementById('map-island');
            if (mapIsland) mapIsland.style.display = 'block';
            stopGameTimer(); stopEventScheduler(); clearAllEventImages();
        } else if (screenToShow === layer4) {
            if (mainBgSlideshow) mainBgSlideshow.style.display = 'none';
            document.body.style.backgroundImage = "url('pic/sur/s.png')";
            stopGameTimer();
        } else if (screenToShow === layer5) {
            if (mainBgSlideshow) mainBgSlideshow.style.display = 'none';
            document.body.style.backgroundImage = 'none';
            stopGameTimer(); stopEventScheduler(); clearAllEventImages();
        } else if (screenToShow === layer3) {
            if (mainBgSlideshow) mainBgSlideshow.style.display = 'none';
            document.body.style.backgroundImage = 'none';
        }
    }

    // ── Clock ────────────────────────────────────────────────────
    const clockCanvas = document.getElementById('clock-canvas');
    const ctx = clockCanvas ? clockCanvas.getContext('2d') : null;

    function drawClock(t, total) {
        if (!ctx) return;
        const size = clockCanvas.width;
        const cx = size/2, cy = size/2, r = size/2 - 2;
        const progress = t / total;
        ctx.clearRect(0, 0, size, size);

        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + (1-progress)*Math.PI*2, false);
        ctx.closePath(); ctx.fillStyle = '#c47d3a'; ctx.fill();

        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, -Math.PI/2 + (1-progress)*Math.PI*2, -Math.PI/2 + Math.PI*2, false);
        ctx.closePath(); ctx.fillStyle = '#6ab4d8'; ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2.5; ctx.stroke();
    }

    function updateTimerUI() {
        const disp  = document.getElementById('game-timer');
        const month = document.getElementById('game-month');
        if (disp) disp.textContent = `${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}`;
        if (month) {
            const names = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
            month.textContent = timeLeft > 0
                ? names[Math.max(0, Math.min(11, 11-Math.floor((timeLeft-1)/30)))]
                : '十二月';
        }
        drawClock(timeLeft, 360);
    }

    function startGameTimer() {
        if (gameTimerInterval) clearInterval(gameTimerInterval);
        timeLeft = 360;
        updateTimerUI();
        gameTimerInterval = setInterval(() => {
            timeLeft--;
            updateTimerUI();
            if (timeLeft <= 0) { stopGameTimer(); stopEventScheduler(); clearAllEventImages(); showScreen(layer5); }
        }, 1000);
    }

    function stopGameTimer() {
        if (gameTimerInterval) { clearInterval(gameTimerInterval); gameTimerInterval = null; }
    }

    // ============================================================
    // ★ 事件排程系統（時間驅動，每 30 秒一個 window）
    // ============================================================

    let usedEvents       = [];   // 本局已用過的題目 index
    let activeEventSlots = [];   // 目前畫面上存在的事件：[{ ev, imgEl, timeoutId }]
    let eventWindowCount = 0;    // 本 window 已生成的事件數
    let eventSchedulerId = null; // 每 30 秒重置 window
    let eventSpawnerId   = null; // window 內隨機生成事件的 timer

    function startEventScheduler() {
        stopEventScheduler();
        eventWindowCount = 0;
        scheduleNextSpawn();  // 立刻開始第一次

        // 每 30 秒重置 window 計數，允許再生成
        eventSchedulerId = setInterval(() => {
            eventWindowCount = 0;
            scheduleNextSpawn();
        }, 30000);
    }

    function stopEventScheduler() {
        if (eventSchedulerId) { clearInterval(eventSchedulerId); eventSchedulerId = null; }
        if (eventSpawnerId)   { clearTimeout(eventSpawnerId);   eventSpawnerId   = null; }
    }

    // 在 window 內隨機延遲後嘗試生成一個事件
    function scheduleNextSpawn() {
        if (eventSpawnerId) clearTimeout(eventSpawnerId);
        const delay = randInt(2000, 8000);  // 2~8 秒後嘗試
        eventSpawnerId = setTimeout(() => {
            trySpawnEvent();
        }, delay);
    }

    function trySpawnEvent() {
        const cfg = DIFFICULTY[currentDifficulty];

        // 超過本 window 上限就不生成
        if (eventWindowCount >= cfg.maxPerWindow) return;

        // 從目前場景的未用題目中選一個
        const sceneName = backgrounds[currentBgIndex];
        const pool = EVENTS
            .map((e, i) => ({ e, i }))
            .filter(({ e, i }) => e.scene === sceneName && !usedEvents.includes(i));

        if (pool.length === 0) return;

        const pick = pool[Math.floor(Math.random() * pool.length)];
        const ev   = { ...pick.e, idx: pick.i };

        usedEvents.push(pick.i);
        eventWindowCount++;

        spawnEventImage(ev);

        // 如果還沒到上限，繼續安排下一個
        if (eventWindowCount < cfg.maxPerWindow) {
            scheduleNextSpawn();
        }
    }

    // ── 生成事件圖片 ────────────────────────────────────────────
    function spawnEventImage(ev) {
        const container = document.getElementById('game-container');
        if (!container) return;

        const img = document.createElement('img');
        img.src = ev.image;
        img.alt = 'event';
        img.className = 'event-scene-img';

        const s = ev.imgStyle || {};
        if (s.width)  img.style.width  = s.width;
        if (s.top)    img.style.top    = s.top;
        if (s.left)   img.style.left   = s.left;
        if (s.right)  img.style.right  = s.right;
        if (s.bottom) img.style.bottom = s.bottom;

        container.appendChild(img);
        // 只有在當前場景才顯示，否則先隱藏等切回來
        if (ev.scene === backgrounds[currentBgIndex]) {
            requestAnimationFrame(() => img.classList.add('visible'));
        } else {
            img.style.visibility = 'hidden';
        }

        // 15 秒倒數：超時自動消失並套用效果（不管玩家在哪個場景）
        const cfg = DIFFICULTY[currentDifficulty];
        const slot = { ev, imgEl: img, scene: ev.scene, timeoutId: null };

        slot.timeoutId = setTimeout(() => {
            // 圖片淡出
            img.classList.remove('visible');
            img.classList.add('fading');
            setTimeout(() => img.remove(), 500);

            // 超時效果
            const ignoreChoice = ev.ignore
                ? ev.ignore
                : (Math.random() < 0.5 ? ev.yes : ev.no);  // null → 隨機 yes/no

            const { dv } = applyStatDelta(ignoreChoice);

            // 移除 slot
            activeEventSlots = activeEventSlots.filter(sl => sl !== slot);
        }, cfg.eventLife * 1000);

        // 點擊 → 開啟對話框
        function handleClick(e) {
            e.preventDefault();
            clearTimeout(slot.timeoutId);
            activeEventSlots = activeEventSlots.filter(sl => sl !== slot);
            openDialogBox(ev, img);
        }
        img.addEventListener('click', handleClick);
        img.addEventListener('touchstart', handleClick, { passive: false });

        activeEventSlots.push(slot);
    }

    function clearAllEventImages() {
        activeEventSlots.forEach(sl => {
            clearTimeout(sl.timeoutId);
            sl.imgEl.remove();
        });
        activeEventSlots = [];
        closeDialogBox();
    }

    // ── 對話框（左下角）────────────────────────────────────────
    function openDialogBox(ev, imgEl) {
        // 圖片先消失
        if (imgEl) {
            imgEl.classList.remove('visible');
            imgEl.classList.add('fading');
            setTimeout(() => imgEl.remove(), 400);
        }

        const box      = document.getElementById('dialog-box');
        const evQ      = document.getElementById('dialog-question');
        const evResult = document.getElementById('dialog-result');
        const evBtns   = document.getElementById('dialog-buttons');
        const btnNext  = document.getElementById('dialog-btn-next');

        if (evQ)     evQ.textContent = ev.question;
        if (evResult){ evResult.textContent = ''; evResult.classList.remove('show'); }
        if (evBtns)  evBtns.style.display = 'flex';
        if (btnNext) btnNext.style.display = 'none';

        // 重建是/否按鈕，防止重複監聽
        const oldYes = document.getElementById('dialog-btn-yes');
        const oldNo  = document.getElementById('dialog-btn-no');
        const newYes = oldYes.cloneNode(true);
        const newNo  = oldNo.cloneNode(true);
        oldYes.replaceWith(newYes);
        oldNo.replaceWith(newNo);

        newYes.addEventListener('click', () => choose(ev.yes), { once: true });
        newNo .addEventListener('click', () => choose(ev.no),  { once: true });

        box.classList.add('show');

        function choose(choice) {
            const { dv, ds } = applyStatDelta(choice);

            let extra = '';
            if (dv !== 0) extra += ` 水量 ${dv > 0 ? '+' : ''}${dv}%`;
            if (ds !== 0) extra += ` 淤積 ${ds > 0 ? '+' : ''}${ds}`;

            if (evResult) {
                evResult.textContent = choice.text + (extra ? `（${extra.trim()}）` : '');
                evResult.classList.add('show');
            }
            if (evBtns)  evBtns.style.display = 'none';

            // 重建繼續按鈕
            const freshNext = document.getElementById('dialog-btn-next').cloneNode(true);
            document.getElementById('dialog-btn-next').replaceWith(freshNext);
            freshNext.style.display = 'flex';
            freshNext.addEventListener('click', () => {
                closeDialogBox();
            }, { once: true });
        }
    }

    function closeDialogBox() {
        const box = document.getElementById('dialog-box');
        if (box) box.classList.remove('show');
    }

    // ============================================================
    // ★ 原有 UI 邏輯
    // ============================================================

    btnStart.addEventListener('click', () => showScreen(layer2));
    btnBackToTitle.addEventListener('click', () => showScreen(layer1));

    const mapIsland = document.getElementById('map-island');
    const btnInto   = document.getElementById('btn-into');

    if (mapIsland) {
        function handleMapIslandClick(e) {
            e.preventDefault();
            document.body.style.backgroundImage = "url('pic/sur/chooset.png')";
            mapIsland.style.display = 'none';
            if (btnInto) btnInto.style.display = 'block';
        }
        mapIsland.addEventListener('click', handleMapIslandClick);
        mapIsland.addEventListener('touchstart', handleMapIslandClick, { passive: false });
    }

    if (btnInto) btnInto.addEventListener('click', () => showScreen(layer4));

    const btnBackToLayer2 = document.getElementById('btn-back-to-layer2');
    if (btnBackToLayer2) btnBackToLayer2.addEventListener('click', () => showScreen(layer2));

    // 難易度按鈕
    const diffBtns = document.querySelectorAll('.diff-btn');
    diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentDifficulty = btn.id.replace('btn-', '');  // 'btn-easy' → 'easy'
            if (gameBg) { currentBgIndex = 0; gameBg.src = `pic/place/${backgrounds[0]}.png`; }
            usedEvents = [];
            showScreen(layer3);
            startGameTimer();
            drawClock(360, 360);
            initGameStats();
            startEventScheduler();
        });
    });

    const btnLeft  = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');

    if (btnRight) {
        btnRight.addEventListener('click', () => {
            currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
            if (gameBg) gameBg.src = `pic/place/${backgrounds[currentBgIndex]}.png`;
            updateEventVisibility();
        });
    }
    if (btnLeft) {
        btnLeft.addEventListener('click', () => {
            currentBgIndex = (currentBgIndex - 1 + backgrounds.length) % backgrounds.length;
            if (gameBg) gameBg.src = `pic/place/${backgrounds[currentBgIndex]}.png`;
            updateEventVisibility();
        });
    }

    // 切換場景時：顯示屬於當前場景的事件圖片，隱藏其他場景的
    function updateEventVisibility() {
        const sceneName = backgrounds[currentBgIndex];
        activeEventSlots.forEach(sl => {
            if (sl.scene === sceneName) {
                sl.imgEl.style.visibility = 'visible';
                // 確保有 visible class（進場動畫）
                if (!sl.imgEl.classList.contains('visible')) {
                    sl.imgEl.classList.add('visible');
                }
            } else {
                sl.imgEl.style.visibility = 'hidden';
            }
        });
    }

    const btnReturn = document.getElementById('btn-return');
    if (btnReturn) btnReturn.addEventListener('click', () => showScreen(layer1));
});
