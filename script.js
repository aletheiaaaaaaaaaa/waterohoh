document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const layer1 = document.getElementById('layer1');
    const layer2 = document.getElementById('layer2');
    const layer3 = document.getElementById('layer3');
    const layer4 = document.getElementById('layer4');
    const layer5 = document.getElementById('layer5');

    // Buttons
    const btnStart = document.getElementById('btn-start');
    const btnBackToTitle = document.getElementById('btn-back-to-title');
    
    // Game elements
    const levelCards = document.querySelectorAll('.level-card');
    const gameBg = document.getElementById('game-bg');
    const currentLevelDisplay = document.getElementById('current-level-display');
    const gameTimerDisplay = document.getElementById('game-timer');

    // Slideshow elements
    const mainBgSlideshow = document.getElementById('main-bg-slideshow');
    const bgSlides = document.querySelectorAll('.bg-slide');
    let currentSlideIndex = 0;

    // Slideshow interval (every 10s)
    setInterval(() => {
        bgSlides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % bgSlides.length;
        bgSlides[currentSlideIndex].classList.add('active');
    }, 10000);

    // Layer 3 background array
    const backgrounds = ['w1', 'fo', 't1', 'l1', 's1'];
    let currentBgIndex = 0;

    // Timer variables
    let gameTimerInterval = null;
    let timeLeft = 360; // 6 minutes

    // Navigation functions
    function showScreen(screenToShow) {
        // Hide all screens
        [layer1, layer2, layer3, layer4, layer5].forEach(screen => {
            if (screen) screen.classList.remove('active');
        });
        
        // Show target screen
        if (screenToShow) screenToShow.classList.add('active');

        // Manage body background based on screen
        if (screenToShow === layer1) {
            if (mainBgSlideshow) mainBgSlideshow.style.display = 'block';
            document.body.style.backgroundImage = 'none';
            stopGameTimer();
        } else if (screenToShow === layer2) {
            if (mainBgSlideshow) mainBgSlideshow.style.display = 'none';
            document.body.style.backgroundImage = "url('pic/sur/chooseb.png')";
            
            // Reset layer 2 state
            const btnInto = document.getElementById('btn-into');
            if (btnInto) btnInto.style.display = 'none';
            const mapIsland = document.getElementById('map-island');
            if (mapIsland) mapIsland.style.display = 'block'; // Restore map island
            
            stopGameTimer();
        } else if (screenToShow === layer4) {
            if (mainBgSlideshow) mainBgSlideshow.style.display = 'none';
            document.body.style.backgroundImage = "url('pic/sur/s.png')";
            stopGameTimer();
        } else if (screenToShow === layer5) {
            if (mainBgSlideshow) mainBgSlideshow.style.display = 'none';
            document.body.style.backgroundImage = 'none';
            stopGameTimer();
        } else if (screenToShow === layer3) {
            // In game screen, we hide the main background
            if (mainBgSlideshow) mainBgSlideshow.style.display = 'none';
            document.body.style.backgroundImage = 'none';
        }
    }

    // Clock drawing
    const clockCanvas = document.getElementById('clock-canvas');
    const ctx = clockCanvas ? clockCanvas.getContext('2d') : null;

    function drawClock(timeLeft, totalTime) {
        if (!ctx) return;
        const size = clockCanvas.width;
        const cx = size / 2, cy = size / 2, r = size / 2 - 2;
        const progress = timeLeft / totalTime; // 1 = full, 0 = empty

        ctx.clearRect(0, 0, size, size);

        // Brown fill (elapsed time)
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (1 - progress) * Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = '#c47d3a';
        ctx.fill();

        // Blue fill (remaining time)
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, -Math.PI / 2 + (1 - progress) * Math.PI * 2, -Math.PI / 2 + Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = '#6ab4d8';
        ctx.fill();

        // White border ring
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2.5;
        ctx.stroke();
    }

    // Timer functions
    function updateTimerUI() {
        const gameTimerDisplay = document.getElementById('game-timer');
        const gameMonthDisplay = document.getElementById('game-month');
        
        if (gameTimerDisplay) {
            const m = Math.floor(timeLeft / 60);
            const s = timeLeft % 60;
            gameTimerDisplay.textContent = `${m}:${s.toString().padStart(2, '0')}`;
        }
        
        if (gameMonthDisplay && timeLeft > 0) {
            const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
            const monthIndex = 11 - Math.floor((timeLeft - 1) / 30);
            gameMonthDisplay.textContent = monthNames[Math.max(0, Math.min(11, monthIndex))];
        } else if (gameMonthDisplay && timeLeft <= 0) {
            gameMonthDisplay.textContent = "十二月";
        }

        drawClock(timeLeft, 360);
    }

    function startGameTimer() {
        if (gameTimerInterval) clearInterval(gameTimerInterval);
        
        timeLeft = 360; // 6 minutes
        updateTimerUI();
        
        gameTimerInterval = setInterval(() => {
            timeLeft--;
            updateTimerUI();
            
            if (timeLeft <= 0) {
                stopGameTimer();
                showScreen(layer5);
            }
        }, 1000);
    }

    function stopGameTimer() {
        if (gameTimerInterval) {
            clearInterval(gameTimerInterval);
            gameTimerInterval = null;
        }
    }

    // Event Listeners
    btnStart.addEventListener('click', () => {
        showScreen(layer2);
    });

    btnBackToTitle.addEventListener('click', () => {
        showScreen(layer1);
    });

    // Layer 2 map interaction
    const mapIsland = document.getElementById('map-island');
    const btnInto = document.getElementById('btn-into');
    
    if (mapIsland) {
        // 同時支援 click 和 touchstart，避免平板 300ms 延遲
        function handleMapIslandClick(e) {
            e.preventDefault();
            // Change background
            document.body.style.backgroundImage = "url('pic/sur/chooset.png')";
            // Hide map island
            mapIsland.style.display = 'none';
            // Show into button
            if (btnInto) {
                btnInto.style.display = 'block';
            }
        }
        mapIsland.addEventListener('click', handleMapIslandClick);
        mapIsland.addEventListener('touchstart', handleMapIslandClick, { passive: false });
    }

    if (btnInto) {
        btnInto.addEventListener('click', () => {
            // Navigate to difficulty selection screen (layer 4) instead of game screen
            showScreen(layer4);
        });
    }

    // Layer 4 interactions
    const btnBackToLayer2 = document.getElementById('btn-back-to-layer2');
    if (btnBackToLayer2) {
        btnBackToLayer2.addEventListener('click', () => {
            showScreen(layer2);
        });
    }

    const diffBtns = document.querySelectorAll('.diff-btn');
    diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.getAttribute('data-diff');
            
            // Navigate to game screen
            // Set initial game background to w1.png
            if (gameBg) {
                currentBgIndex = 0; // Reset index
                gameBg.src = `pic/place/${backgrounds[currentBgIndex]}.png`; 
            }
            
            // Can pass difficulty to game logic here if needed in the future
            
            showScreen(layer3);
            startGameTimer();
            drawClock(360, 360); // Draw full clock at start
        });
    });

    // Layer 3 interactions
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    
    function updateLayer3Bg() {
        if (gameBg) {
            gameBg.src = `pic/place/${backgrounds[currentBgIndex]}.png`;
        }
    }

    if (btnRight) {
        btnRight.addEventListener('click', () => {
            currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
            updateLayer3Bg();
        });
    }

    if (btnLeft) {
        btnLeft.addEventListener('click', () => {
            currentBgIndex = (currentBgIndex - 1 + backgrounds.length) % backgrounds.length;
            updateLayer3Bg();
        });
    }

    // Layer 5: End screen
    const btnReturn = document.getElementById('btn-return');
    if (btnReturn) {
        btnReturn.addEventListener('click', () => {
            showScreen(layer1);
        });
    }
});
