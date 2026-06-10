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
            imgStyle: { width: '160px', top: '50%', left: '20%' },
            question: '這個人在開挖土機在幹嘛呢？要阻止他嗎？',
            yes:    { text: '工人覺得有點疑惑還是收工了，清淤工程已停止。',   v: 0, s: 0, vRand: null, sRand: null },
            no:     { text: '原來是在進行清理水庫淤泥的工程，工程繼續。',     v: 0, s: 0, vRand: null, sRand: [-8,-3] },
            ignore: { text: '工程車自行離開了，情況沒有改變。',               v: 0, s: 0, vRand: null, sRand: null },
        },
        {
            scene: 'w1',
            image: 'pic/man/m3.png',
            imgStyle: { width: '100px', top: '17%', left: '60%' },
            question: '水表面有一大塊綠色的東西在漂，要處理嗎？',
            yes:    { text: '原來是藻類，啟動除藻，水質維持正常。',            v: 0, s: 0, vRand: null, sRand: null },
            no:     { text: '藻華大量繁殖，水庫優養化，部分水源無法使用。',    v: 0, s: 0, vRand: [-30,-15], sRand: [3,6] },
            ignore: null,
        },
        {
            scene: 'w1',
            image: 'pic/man/m1.png',
            imgStyle: { width: '60px', top: '13%', left: '50%' },
            question: '有人在釣魚呢，要阻止他嗎？',
            yes:    { text: '釣客被依法取締，水庫並非釣魚場所。',              v: 0, s: 0, vRand: null, sRand: null },
            no:     { text: '釣客繼續釣魚，魚餌、鉛錘沉入水底污染水質。',      v: 0, s: 0, vRand: [-3,-1], sRand: null },
            ignore: null,
        },

        // ── fo 工廠 ────────────────────────────────────────────
        {
            scene: 'fo',
            image: 'pic/man/m5.png',
            imgStyle: { width: '150px', top: '65%', left: '40%' },
            question: '河面上有很多翻肚的魚，要處理嗎？',
            yes:    { text: '工廠洩漏的污染源已查明並處理。',                  v: 0, s: 0, vRand: [-10,-5], sRand: null },
            no:     { text: '污染持續擴散，大範圍水源受影響。',                v: 0, s: 0, vRand: [-50,-25], sRand: [5,10] },
            ignore: null,
        },
        {
            scene: 'fo',
            image: 'pic/man/m4.png',
            imgStyle: { width: '60px', top: '65%', left: '80%' },
            question: '有幾個看著冒出奇怪液體的桶，要處理嗎？',
            yes:    { text: '確認是違法棄置有毒廢液，妥善清除。',              v: 0, s: 0, vRand: null, sRand: null },
            no:     { text: '桶子腐蝕後液體滲入土壤與地下水。',               v: 0, s: 0, vRand: [-18,-8], sRand: null },
            ignore: null,
        },

        // ── t1 農田 ────────────────────────────────────────────
        {
            scene: 't1',
            image: 'pic/man/m6.png',
            imgStyle: { width: '230px', top: '55%', left: '20%' },
            question: '有人在水渠用水管往田裡接水，要阻止他嗎？',
            yes:    { text: '確認是盜引灌溉水，制止了違規行為。',              v: 0, s: 0, vRand: [-5,-2], sRand: null },
            no:     { text: '非法抽水沒被阻止，被抽得更多了。',               v: 0, s: 0, vRand: [-12,-5], sRand: null },
            ignore: null,
        },
        {
            scene: 't1',
            image: 'pic/man/m7.png',
            imgStyle: { width: '130px', top: '65%', left: '42%' },
            question: '有一空桶子被丟在溝渠旁，要處理嗎？',
            yes:    { text: '確認是農藥空桶違法棄置，妥善清運並未污染。',      v: 0, s: 0, vRand: null, sRand: null },
            no:     { text: '殘留農藥隨雨水滲漏進水渠與土地中。',             v: 0, s: 0, vRand: [-10,-4], sRand: null },
            ignore: null,
        },

        // ── s1 街道 ────────────────────────────────────────────
        {
            scene: 's1',
            image: 'pic/man/m8.png',
            imgStyle: { width: '60px', top: '75%', left: '45%' },
            question: '街道上有個消防栓一直在流出水呢，要處理嗎？',
            yes:    { text: '確認消防栓未確實關閉，已做處理。',                v: 0, s: 0, vRand: [-3,-1], sRand: null },
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
    // itemCount    : 開局道具張數
    const DIFFICULTY = {
        easy:   { maxPerWindow: 2, eventLife: 15, itemCount: 3 },
        normal: { maxPerWindow: 3, eventLife: 15, itemCount: 2 },
        hard:   { maxPerWindow: 4, eventLife: 15, itemCount: 1 },
    };
    let currentDifficulty = 'normal';

    // ── 道具定義 ────────────────────────────────────────────────
    const ITEMS_DEF = [
        {
            id: 'd1',
            name: '勸導節水',
            img: 'pic/item/d1.png',
            // 條件：可用水量 < 50%
            canUse: () => gameStats.vPct < 50,
            // 效果：接下來 3 個月，月用水量 -10~20%
            apply: (state) => {
                const pct = randInt(10, 20) / 100;
                state.usageMultExtra = Math.max(0, (state.usageMultExtra ?? 1) - pct);
                state.usageDurLeft   = 3;
                return `勸導節水啟動！\n接下來 3 個月用水量 -${Math.round(pct*100)}%`;
            },
        },
        {
            id: 'd2',
            name: '強制限水',
            img: 'pic/item/d2.png',
            // 條件：可用水量 < 30%
            canUse: () => gameStats.vPct < 30,
            apply: (state) => {
                state.usageMultExtra = Math.max(0, (state.usageMultExtra ?? 1) - 0.50);
                state.usageDurLeft   = 1;
                return `強制限水啟動！\n本月用水量 -50%`;
            },
        },
        {
            id: 'd3',
            name: '清淤工程',
            img: 'pic/item/d3.png',
            canUse: () => true,
            apply: (state) => {
                const pct = randInt(3, 5) / 100;
                state.siltRedPct    = pct;
                state.siltDurLeft   = 3;
                return `清淤工程啟動！\n接下來 3 個月淤積量 -${Math.round(pct*100)}%/月`;
            },
        },
        {
            id: 'd4',
            name: '人工降雨',
            img: 'pic/item/d4.png',
            canUse: () => true,
            apply: (state) => {
                const pct = randInt(5, 10) / 100;
                state.rainBonus    = pct;
                state.rainDurLeft  = 1;
                return `人工降雨啟動！\n本月降雨量 +${Math.round(pct*100)}%`;
            },
        },
    ];

    // ── 道具狀態 ────────────────────────────────────────────────
    let itemState = {
        hand: [],           // 手牌：ITEMS_DEF 的 id 陣列（依開局隨機選取）
        usedThisMonth: false, // 本月已用道具？
        // active effects
        usageMultExtra: 1,  // 月用水倍率（道具疊加在 typhoon 倍率上）
        usageDurLeft:   0,
        siltRedPct:     0,  // 每月淤積減少 %
        siltDurLeft:    0,
        rainBonus:      0,  // 降雨量加成 %
        rainDurLeft:    0,
    };
    let itemToastTimer = null;
    let currentYearType   = 'normal'; // 開局骰出，與難易度無關

    // ── 月降雨資料（來源：w.csv，單位 mm）─────────────────────────
    // 索引 0 = 一月，11 = 十二月
    const MONTHLY_RAIN = [
        { dry: [30,  60],  normal: [60,  100], rich: [100, 160] }, // 1
        { dry: [40,  70],  normal: [70,  110], rich: [110, 170] }, // 2
        { dry: [50,  90],  normal: [90,  140], rich: [140, 200] }, // 3
        { dry: [60, 100],  normal: [100, 160], rich: [160, 230] }, // 4
        { dry: [80, 130],  normal: [150, 250], rich: [250, 350] }, // 5
        { dry: [90, 150],  normal: [150, 250], rich: [250, 380] }, // 6
        { dry: [50, 120],  normal: [120, 220], rich: [220, 380] }, // 7
        { dry: [60, 140],  normal: [140, 280], rich: [280, 450] }, // 8
        { dry: [50, 130],  normal: [130, 280], rich: [280, 450] }, // 9
        { dry: [30,  80],  normal: [130, 280], rich: [280, 450] }, // 10
        { dry: [30,  80],  normal: [80,  160], rich: [160, 260] }, // 11
        { dry: [30,  80],  normal: [80,  160], rich: [160, 262] }, // 12
    ];

    // ── Screens ──────────────────────────────────────────────────
    const layer1 = document.getElementById('layer1');
    const layer2 = document.getElementById('layer2');
    const layer3 = document.getElementById('layer3');
    const layer4 = document.getElementById('layer4');
    const layer5 = document.getElementById('layer5');
    const layer6 = document.getElementById('layer6');

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
    let currentTyphoonRain = 0;
    let currentTyphoonInflowMult = 1;
    let currentTyphoonSupplyMult = 1;
    let currentMonthRainMm = 0;
    let currentMonthRainDv = 0;

    // ── 動態背景圖片 ──────────────────────────────────────────────
    function updateGameBackground() {
        if (!gameBg) return;
        let bgName = backgrounds[currentBgIndex];
        
        // 判斷是否需要切換 w1/w2 圖片
        if (bgName === 'w1' && gameStats && gameStats.totalCap) {
            const a = gameStats.totalCap - gameStats.silt;
            const waterVol = (gameStats.vPct / 100) * gameStats.totalCap;
            if (waterVol <= a * 0.5) {
                bgName = 'w2';
            }
        }
        
        gameBg.src = `pic/place/${bgName}.png`;
    }

    function updateStatsUI() {
        const elPct    = document.getElementById('info-v-pct');
        const elSilt   = document.getElementById('info-silt');
        const elRain   = document.getElementById('info-rain');
        const elUsage  = document.getElementById('info-usage');
        const barSilt  = document.getElementById('info-bar-silt');
        const barWater = document.getElementById('info-bar-water');

        const waterM3 = Math.round((gameStats.vPct / 100) * gameStats.totalCap);
        if (elPct) elPct.textContent = `${waterM3.toLocaleString()} 萬立方公尺`;
        if (elSilt)  elSilt.textContent  = gameStats.silt.toLocaleString();
        if (elRain)  elRain.textContent  = gameStats.rain;

        // 若有颱風影響，更新民生供水顯示（依比例減少）
        const currentUsage = Math.round(gameStats.usage * currentTyphoonSupplyMult);
        if (elUsage) elUsage.textContent = currentUsage.toLocaleString();

        const siltPct = parseFloat(((gameStats.silt / gameStats.totalCap) * 100).toFixed(2));
        if (barSilt)  barSilt.style.width  = siltPct + '%';
        if (barWater) {
            barWater.style.width = gameStats.vPct + '%';
            barWater.style.left  = siltPct + '%'; // 緊接在淤積後面
        }
    }

    // 開局骰年型：乾旱年 30%，正常年 50%，豐水年 20%
    function rollYearType() {
        const r = Math.random();
        if (r < 0.30) return 'dry';     // 乾旱年
        if (r < 0.80) return 'normal';  // 正常年
        return 'rich';                   // 豐水年
    }

    function initGameStats() {
        currentYearType = rollYearType();
        const totalCap  = 40000;
        // 淤積 30~35% of totalCap（萬立方公尺）
        const silt = Math.round(randInt(30, 35) / 100 * totalCap);
        const maxVPct = ((totalCap - silt) / totalCap) * 100;

        gameStats = {
            vPct:     Math.min(randInt(40, 60), maxVPct), // 開局水量不能超過空餘容量
            totalCap: totalCap,
            silt:     silt,
            rain:     0,
            usage:    randInt(3000, 5000), // 調低基礎用水量，避免太容易死掉
        };
        currentTyphoonRain = 0;
        currentTyphoonInflowMult = 1;
        currentTyphoonSupplyMult = 1;
        updateStatsUI();
    }

    // 套用數值變化，並顯示左上角增減提示
    // vRand 單位現為「立方公尺」，會先換算成 % 再套用
    function applyStatDelta(choice) {
        let dv = choice.v || 0;
        let ds = choice.s || 0;

        if (choice.vRand) {
            // vRand 是萬立方公尺，除以 totalCap 換成 %
            const rawWanM3 = randInt(choice.vRand[0], choice.vRand[1]);
            dv += parseFloat((rawWanM3 / gameStats.totalCap * 100).toFixed(2));
        }
        if (choice.sRand) {
            // sRand 是萬立方公尺，直接加進淤積量
            ds += randInt(choice.sRand[0], choice.sRand[1]);
        }

        gameStats.silt = Math.max(0, gameStats.silt + ds); // silt 單位為萬立方公尺
        
        // 重新計算最大可用水比例 (100% - 淤積%)
        const maxVPct = ((gameStats.totalCap - gameStats.silt) / gameStats.totalCap) * 100;

        dv = parseFloat(dv.toFixed(2));
        gameStats.vPct = parseFloat((Math.max(0, Math.min(maxVPct, gameStats.vPct + dv))).toFixed(2));
        
        updateStatsUI();

        // 顯示左上角 +n% / -n% 提示
        if (dv !== 0) showDeltaBadge(dv);

        checkGameOver();

        return { dv, ds };
    }

    // ── 檢查 Game Over 條件（可用水量 <= 淤積量）───────────────────
    function checkGameOver() {
        if (!gameStats || !gameStats.totalCap) return;
        const waterVol = (gameStats.vPct / 100) * gameStats.totalCap;
        const a = gameStats.totalCap - gameStats.silt;
        
        // 新增動態背景檢查：當 a 的 50% 大於等於可用水，且在第一張場景，就替換為 w2
        updateGameBackground();

        // 遊戲失敗條件：總容量減去淤積量(a)的 10% 大於等於可用水量
        if (waterVol <= a * 0.1) {
            stopGameTimer(); 
            stopEventScheduler(); 
            clearAllEventImages();
            showScreen(layer6);
        }
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
        [layer1, layer2, layer3, layer4, layer5, layer6].forEach(s => {
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
        } else if (screenToShow === layer5 || screenToShow === layer6) {
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

            // 每月第一秒（剩29秒時）觸發颱風判定
            if (timeLeft > 0 && timeLeft % 30 === 29) {
                checkTyphoon();
            }

            // 每月剩 15 秒時，自動套用前半個月降雨進水量
            if (timeLeft > 0 && timeLeft % 30 === 15) {
                applyHalfRainfall(true);
            }

            // 每月剩 5 秒時，自動套用後半個月降雨進水量
            if (timeLeft > 0 && timeLeft % 30 === 5) {
                applyHalfRainfall(false);
            }

            // 每月剩 2 秒時，扣除當月民生用水
            if (timeLeft > 0 && timeLeft % 30 === 2) {
                applyMonthlyUsage();
            }

            if (timeLeft <= 0) { stopGameTimer(); stopEventScheduler(); clearAllEventImages(); showScreen(layer5); }
        }, 1000);
    }

    function stopGameTimer() {
        if (gameTimerInterval) { clearInterval(gameTimerInterval); gameTimerInterval = null; }
    }

    // ── 道具牌核心函式 ──────────────────────────────────────────

    function dealItems(difficulty) {
        const count = DIFFICULTY[difficulty].itemCount;
        // 隨機打亂 ITEMS_DEF，取前 count 張
        const shuffled = [...ITEMS_DEF].sort(() => Math.random() - 0.5);
        itemState.hand = shuffled.slice(0, count).map(d => d.id);
        itemState.usedThisMonth = false;
        // 重置所有效果
        itemState.usageMultExtra = 1;
        itemState.usageDurLeft   = 0;
        itemState.siltRedPct     = 0;
        itemState.siltDurLeft    = 0;
        itemState.rainBonus      = 0;
        itemState.rainDurLeft    = 0;
        renderItemTray();
        ensureItemToast();
    }

    function ensureItemToast() {
        if (!document.getElementById('item-toast')) {
            const t = document.createElement('div');
            t.id = 'item-toast';
            const container = document.getElementById('game-container');
            if (container) container.appendChild(t);
        }
    }

    function showItemToast(msg) {
        const t = document.getElementById('item-toast');
        if (!t) return;
        clearTimeout(itemToastTimer);
        t.textContent = msg;
        t.classList.add('show');
        itemToastTimer = setTimeout(() => t.classList.remove('show'), 3500);
    }

    function renderItemTray() {
        const tray = document.getElementById('item-tray');
        if (!tray) return;
        tray.innerHTML = '';

        itemState.hand.forEach(id => {
            const def = ITEMS_DEF.find(d => d.id === id);
            if (!def) return;

            const img = document.createElement('img');
            img.src = def.img;
            img.alt = def.name;
            img.title = def.name;
            img.dataset.itemId = id;
            img.className = 'item-card';

            updateCardDisabled(img, def);

            img.addEventListener('click', () => onItemClick(img, def));
            tray.appendChild(img);
        });
    }

    function updateCardDisabled(imgEl, def) {
        const disabled = itemState.usedThisMonth || !def.canUse();
        imgEl.classList.toggle('item-disabled', disabled);
    }

    function refreshItemDisabledStates() {
        const tray = document.getElementById('item-tray');
        if (!tray) return;
        tray.querySelectorAll('.item-card').forEach(imgEl => {
            const def = ITEMS_DEF.find(d => d.id === imgEl.dataset.itemId);
            if (def) updateCardDisabled(imgEl, def);
        });
    }

    function onItemClick(imgEl, def) {
        if (itemState.usedThisMonth) {
            showItemToast('本月已使用道具，下個月才能再用！');
            return;
        }
        if (!def.canUse()) {
            const hints = {
                d1: '可用水量需低於 50% 才能使用',
                d2: '可用水量需低於 30% 才能使用',
            };
            showItemToast(hints[def.id] || '目前無法使用此道具');
            return;
        }

        // 標記本月已用
        itemState.usedThisMonth = true;

        // 套用效果
        const msg = def.apply(itemState);

        // 動畫：使用牌
        imgEl.classList.add('item-used');
        setTimeout(() => {
            // 從 hand 移除
            itemState.hand = itemState.hand.filter(id => id !== def.id);
            renderItemTray();
        }, 480);

        showItemToast(msg);
        refreshItemDisabledStates();
    }

    // 每月結算時呼叫（在 applyMonthlyRainfall / applyMonthlyUsage 後）
    function tickItemEffects() {
        // 用水倍率 tick
        if (itemState.usageDurLeft > 0) {
            itemState.usageDurLeft--;
            if (itemState.usageDurLeft <= 0) {
                itemState.usageMultExtra = 1; // 效果結束，恢復
            }
        }
        // 清淤 tick
        if (itemState.siltDurLeft > 0) {
            // 本月清淤：減少淤積量
            const siltRedAbs = gameStats.silt * itemState.siltRedPct;
            gameStats.silt = Math.max(0, Math.round(gameStats.silt - siltRedAbs));
            itemState.siltDurLeft--;
            if (itemState.siltDurLeft <= 0) {
                itemState.siltRedPct = 0;
            }
        }
        // 降雨加成 tick（在 rainfall 之後，只做 durLeft 遞減）
        if (itemState.rainDurLeft > 0) {
            itemState.rainDurLeft--;
            if (itemState.rainDurLeft <= 0) {
                itemState.rainBonus = 0;
            }
        }
        // 月份重置：可再用道具
        itemState.usedThisMonth = false;
        refreshItemDisabledStates();
        updateStatsUI();
    }

    // 取得本月有效用水倍率（typhoon × item）
    function getUsageMult() {
        return currentTyphoonSupplyMult * itemState.usageMultExtra;
    }

    // 取得本月有效降雨加成倍率
    function getRainMult() {
        return 1 + itemState.rainBonus;
    }

    // ── 月降雨進水（分兩次套用）──────────────────────
    function applyHalfRainfall(isFirstHalf) {
        const halfDv = isFirstHalf ? parseFloat((currentMonthRainDv / 2).toFixed(1)) : parseFloat((currentMonthRainDv - parseFloat((currentMonthRainDv / 2).toFixed(1))).toFixed(1));
        const halfMm = isFirstHalf ? Math.floor(currentMonthRainMm / 2) : currentMonthRainMm - Math.floor(currentMonthRainMm / 2);

        // 最大可用水比例
        const maxVPct = ((gameStats.totalCap - gameStats.silt) / gameStats.totalCap) * 100;
        gameStats.vPct = parseFloat((Math.max(0, Math.min(maxVPct, gameStats.vPct + halfDv))).toFixed(1));
        
        gameStats.rain += halfMm;   // 累加當月顯示的降雨量
        updateStatsUI();
        showRainBadge(halfDv);      // 專屬青綠色 badge

        // 只有在月底（第二次降雨時）才結算道具效果
        if (!isFirstHalf) {
            tickItemEffects();
        }

        checkGameOver();
    }

    // ── 月用水扣除（每月剩 2 秒時自動觸發）──────────────────────
    function applyMonthlyUsage() {
        const actualUsage = Math.round(gameStats.usage * getUsageMult());
        const drop = parseFloat((actualUsage / gameStats.totalCap * 100).toFixed(1));

        gameStats.vPct = parseFloat((Math.max(0, gameStats.vPct - drop)).toFixed(1));
        updateStatsUI();

        // 顯示紅色的扣除 badge
        showDeltaBadge(-drop);
        
        checkGameOver();
    }

    // ── 降雨專屬 badge（藍綠色，與事件效果做區隔）────────────────
    function showRainBadge(dv) {
        const badge = document.getElementById('info-delta-badge');
        if (!badge) return;
        clearTimeout(deltaBadgeTimeout);
        badge.textContent = '🌧 +' + dv + '%';
        badge.className   = 'info-delta-badge rain show';
        deltaBadgeTimeout = setTimeout(() => badge.classList.remove('show'), 2500);
    }

    // ── 颱風系統 ────────────────────────────────────────────────
    let typhoonDialogTimeout = null;

    // 月底顯示用水量時也更新 UI（getUsageMult 已含 item 效果）
    function showTyphoonDialog(msg) {
        const dialog = document.getElementById('typhoon-dialog');
        const text = document.getElementById('typhoon-text');
        const btn = document.getElementById('typhoon-btn-ok');

        if (!dialog || !text || !btn) return;

        text.innerText = msg;
        dialog.classList.add('show');

        if (typhoonDialogTimeout) clearTimeout(typhoonDialogTimeout);

        typhoonDialogTimeout = setTimeout(() => {
            dialog.classList.remove('show');
        }, 5000); // 延長至 5 秒以便玩家閱讀

        btn.onclick = () => {
            clearTimeout(typhoonDialogTimeout);
            dialog.classList.remove('show');
        };
    }

    function checkTyphoon() {
        // 每個月初重置颱風狀態與重新骰當月基本用水量
        currentTyphoonRain = 0;
        currentTyphoonInflowMult = 1;
        currentTyphoonSupplyMult = 1;
        gameStats.usage = randInt(3000, 5000); // 重置為較合理的基礎用水量

        const monthIdx = Math.max(0, Math.min(11, 11 - Math.floor((timeLeft - 1) / 30)));
        const month = monthIdx + 1; // 1 to 12
        
        let prob = 0;
        if (month === 7) prob = 0.15;
        else if (month === 8) prob = 0.30;
        else if (month === 9) prob = 0.30;
        else if (month === 10) prob = 0.15;
        
        if (Math.random() < prob) {
            const r = Math.random();
            let typeName = "";
            if (r < 0.50) {
                typeName = "小颱風";
                currentTyphoonRain = 200;
                currentTyphoonInflowMult = 0.85;
                currentTyphoonSupplyMult = 1;
            } else if (r < 0.85) {
                typeName = "中颱風";
                currentTyphoonRain = 400;
                currentTyphoonInflowMult = 0.70;
                currentTyphoonSupplyMult = 0.50;
            } else {
                typeName = "強烈颱風";
                currentTyphoonRain = 600;
                currentTyphoonInflowMult = 0.50;
                currentTyphoonSupplyMult = 0.20;
            }

            let msg = `⚠️ 發生${typeName}！\n帶來當月降雨 +${currentTyphoonRain}mm`;
            if (currentTyphoonSupplyMult < 1) {
                msg += `\n原水濁度升高，影響民生供水`;
            }

            showTyphoonDialog(msg);
        }

        // 預先計算本月的總降雨與進水，儲存起來分兩次發放
        const [rMin, rMax] = MONTHLY_RAIN[monthIdx][currentYearType];
        const baseRain = randInt(rMin, rMax) + currentTyphoonRain;
        currentMonthRainMm = Math.round(baseRain * getRainMult());
        const efficiency = randInt(50, 70) / 100;
        const inflow = currentMonthRainMm * 77 * efficiency * currentTyphoonInflowMult;
        currentMonthRainDv = parseFloat((inflow / gameStats.totalCap * 100).toFixed(1));
        
        gameStats.rain = 0; // 新月份開始，重置顯示的累積降雨量

        updateStatsUI(); // 更新 usage 顯示
    }

    // ============================================================
    // ★ 事件排程系統（時間驅動，每 30 秒一個 window）
    // ============================================================

    let usedEvents       = [];   // 本局已用過的題目 index（用完自動重置）
    let activeEventSlots = [];   // 目前畫面上存在的事件：[{ ev, imgEl, timeoutId }]
    let eventSchedulerId = null; // 每 30 秒觸發新 window 的 interval
    let eventSpawnTimers = [];   // window 內各事件的 spawn setTimeout 集合

    function startEventScheduler() {
        stopEventScheduler();
        spawnWindow();  // 立刻執行第一個 window

        // 每 30 秒執行一個新 window
        eventSchedulerId = setInterval(() => {
            spawnWindow();
        }, 30000);
    }

    function stopEventScheduler() {
        if (eventSchedulerId) { clearInterval(eventSchedulerId); eventSchedulerId = null; }
        // 清除所有待生成的 spawn timers
        eventSpawnTimers.forEach(t => clearTimeout(t));
        eventSpawnTimers = [];
    }

    // 一個 window 內，直接排程 maxPerWindow 個事件（各自隨機延遲）
    function spawnWindow() {
        const cfg = DIFFICULTY[currentDifficulty];
        for (let i = 0; i < cfg.maxPerWindow; i++) {
            const delay = randInt(2000, 27000);  // 在 30 秒內隨機分散
            const t = setTimeout(() => {
                trySpawnEvent();
            }, delay);
            eventSpawnTimers.push(t);
        }
    }

    function trySpawnEvent() {
        // 從「所有場景」的未用題目中選（切場景後才顯示）
        let pool = EVENTS.map((e, i) => ({ e, i })).filter(({ i }) => !usedEvents.includes(i));

        // 全部用完則重置，允許題目循環
        if (pool.length === 0) {
            usedEvents = [];
            pool = EVENTS.map((e, i) => ({ e, i }));
        }

        const pick = pool[Math.floor(Math.random() * pool.length)];
        const ev   = { ...pick.e, idx: pick.i };

        usedEvents.push(pick.i);
        spawnEventImage(ev);
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
        const slot = { ev, imgEl: img, scene: ev.scene, timeoutId: null, answered: false };

        slot.timeoutId = setTimeout(() => {
            // 若此事件的對話框正開著（未作答），也一起關閉
            if (activeDialogSlot === slot) {
                closeDialogBox();
            }
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

        // 點擊 → 開啟對話框（slot 仍留在 activeEventSlots，計時繼續）
        function handleClick(e) {
            e.preventDefault();
            openDialogBox(ev, img, slot);
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
    let activeDialogSlot = null;  // 目前對話框對應的 slot（未作答狀態）

    function openDialogBox(ev, imgEl, slot) {
        // 點擊圖片時不隱藏圖片，讓玩家在回答問題時還能看到事件主角
        // 加上一點特效表示正在互動
        if (imgEl) {
            imgEl.style.filter = 'drop-shadow(0 4px 18px rgba(255,220,80,0.9))';
            imgEl.style.transform = 'scale(1.05)';
        }

        activeDialogSlot = slot || null;

        const box      = document.getElementById('dialog-box');
        const evQ      = document.getElementById('dialog-text');
        const evResult = document.getElementById('dialog-result');
        const evBtns   = document.getElementById('dialog-options');
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
            // 已經作答，取消原本的 15 秒超時懲罰計時器
            if (slot && slot.timeoutId) {
                clearTimeout(slot.timeoutId);
            }
            activeDialogSlot = null;  // 已作答，解除追蹤

            const { dv, ds } = applyStatDelta(choice);

            // 圖片現在才真正隱藏並移除
            if (imgEl) {
                imgEl.style.filter = '';
                imgEl.style.transform = '';
                imgEl.classList.remove('visible');
                imgEl.classList.add('fading');
                setTimeout(() => imgEl.remove(), 400);
            }

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

            // 3 秒內不點就自動關閉
            const autoClose = setTimeout(() => closeDialogBox(), 3000);

            freshNext.addEventListener('click', () => {
                clearTimeout(autoClose);
                closeDialogBox();
            }, { once: true });
        }
    }

    function closeDialogBox() {
        const box = document.getElementById('dialog-box');
        if (box) box.classList.remove('show');
        
        // 確保選項按鈕和下一個按鈕立刻隱藏，防止任何意外被點擊
        const evBtns = document.getElementById('dialog-options');
        if (evBtns) evBtns.style.display = 'none';
        const btnNext = document.getElementById('dialog-btn-next');
        if (btnNext) btnNext.style.display = 'none';

        activeDialogSlot = null;
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
            if (gameBg) { currentBgIndex = 0; updateGameBackground(); }
            usedEvents = [];
            showScreen(layer3);
            startGameTimer();
            drawClock(360, 360);
            initGameStats();
            startEventScheduler();
            dealItems(currentDifficulty);  // ← 開局發道具牌
        });
    });

    const btnLeft  = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');

    if (btnRight) {
        btnRight.addEventListener('click', () => {
            currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
            updateGameBackground();
            updateEventVisibility();
        });
    }
    if (btnLeft) {
        btnLeft.addEventListener('click', () => {
            currentBgIndex = (currentBgIndex - 1 + backgrounds.length) % backgrounds.length;
            updateGameBackground();
            updateEventVisibility();
        });
    }

    // 切換場景時：顯示屬於當前場景的事件圖片，隱藏其他場景的
    function updateEventVisibility() {
        const sceneName = backgrounds[currentBgIndex];

        // 若對話框開著且未作答，關閉它並讓圖片恢復原狀（玩家需重新點擊）
        if (activeDialogSlot) {
            closeDialogBox();
            const ri = activeDialogSlot.imgEl;
            ri.style.filter = '';
            ri.style.transform = '';
            // 復活：若屬於新場景就顯示，否則先隱藏
            if (activeDialogSlot.scene === sceneName) {
                ri.style.visibility = 'visible';
                requestAnimationFrame(() => ri.classList.add('visible'));
            } else {
                ri.style.visibility = 'hidden';
                ri.classList.add('visible');  // 保留 class，等切回來再顯示
            }
            activeDialogSlot = null;
        }

        activeEventSlots.forEach(sl => {
            if (sl.scene === sceneName) {
                sl.imgEl.style.visibility = 'visible';
                if (!sl.imgEl.classList.contains('visible')) {
                    sl.imgEl.classList.add('visible');
                }
            } else {
                sl.imgEl.style.visibility = 'hidden';
            }
        });
    }

    const btnReturn = document.getElementById('btn-return');
    if (btnReturn) btnReturn.addEventListener('click', () => showScreen(layer2)); // 回到選關

    const btnReturnBad = document.getElementById('btn-return-bad');
    if (btnReturnBad) btnReturnBad.addEventListener('click', () => showScreen(layer2)); // 回到選關
});
