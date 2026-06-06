document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const layer1 = document.getElementById('layer1');
    const layer2 = document.getElementById('layer2');
    const layer3 = document.getElementById('layer3');

    // Buttons
    const btnStart = document.getElementById('btn-start');
    const btnBackToTitle = document.getElementById('btn-back-to-title');
    const btnBackToLevels = document.getElementById('btn-back-to-levels');
    
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

    // Timer variables
    let gameTimerInterval = null;
    let timeLeft = 300;

    // Navigation functions
    function showScreen(screenToShow) {
        // Hide all screens
        [layer1, layer2, layer3].forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        screenToShow.classList.add('active');

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
        } else if (screenToShow === layer3) {
            // In game screen, we hide the main background
            if (mainBgSlideshow) mainBgSlideshow.style.display = 'none';
            document.body.style.backgroundImage = 'none';
        }
    }

    // Timer functions
    function startGameTimer() {
        if (gameTimerInterval) clearInterval(gameTimerInterval);
        
        timeLeft = 300;
        gameTimerDisplay.textContent = timeLeft;
        
        gameTimerInterval = setInterval(() => {
            timeLeft--;
            gameTimerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                stopGameTimer();
                alert('時間到！遊戲結束。');
                showScreen(layer2);
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

    btnBackToLevels.addEventListener('click', () => {
        showScreen(layer2);
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
        function handleIntoClick(e) {
            e.preventDefault();
            // Navigate to game screen
            const gameBg = document.getElementById('game-bg');
            if (gameBg && !gameBg.src.includes('pic/place/pw')) {
                gameBg.src = 'pic/place/pw1.png'; 
            }
            showScreen(layer3);
            startGameTimer();
        }
        btnInto.addEventListener('click', handleIntoClick);
        btnInto.addEventListener('touchstart', handleIntoClick, { passive: false });
    }
});
