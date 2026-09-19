document.addEventListener('DOMContentLoaded', () => {
    const btnNo = document.getElementById('btnNo');
    const stringStage = document.getElementById('stringStage');
    const cupidIntroOverlay = document.getElementById('cupidIntroOverlay');

    if (btnNo) {
        btnNo.addEventListener('mouseover', moveButton);
        btnNo.addEventListener('touchstart', moveButton);
    }

    if (stringStage) {
        setupStringChallenge(stringStage);
    }

    if (cupidIntroOverlay) {
        initCupidIntro();
    }

    // Fail-safe delegated navigation listener for all next/back buttons
    document.addEventListener('click', (e) => {
        const navBtn = e.target.closest('.btn-next, .btn-back');
        if (navBtn) {
            const href = navBtn.getAttribute('href');
            if (href && href !== '#') {
                window.location.href = href;
            }
        }
    });
});

const memoryList = [
    { src: 'images/photo1.jpg', caption: 'January: Every year begins with January, but my year begins with you. 🌸' },
    { src: 'images/photo7.jpg', caption: 'February: In the month of love, I don’t need roses… I have you. 💕' },
    { src: 'images/photo5.jpg', caption: 'March: Beautiful things grow slowly — just like our love. 🌷' },
    { src: 'images/Yedi.jpeg', caption: 'April: April brings flowers, but you brought colour into my life. 🌺' },
    { src: 'images/photo10.jpg', caption: 'May: May every day give me another reason to fall for you. 🌹' },
    { src: 'images/photo13.jpeg', caption: 'June: Half the year gone, but our love is only getting started. 💖' },
    { src: 'images/july.jpeg', caption: 'July: July nights are beautiful, but nothing compares to you. ✨' },
    { src: 'images/photo8.jpg', caption: 'August: You didn’t just enter my life — you became my life. 💓' },
    { src: 'images/sep.jpeg', caption: 'September: Everything changes, but I never want us to change. 🎂' },
    { src: 'images/oct.jpeg', caption: 'October: Like autumn leaves, I will always choose you. 🍂' },
    { src: 'images/nov.jpeg', caption: 'November: You are my biggest reason to be grateful. 🍁' },
    { src: 'images/photo7.jpg', caption: 'December: The year ends, but our love story has no ending. ❤️' }
];

let slideshowTimer = null;
let currentSlideIndex = 0;
let heartBurstTimer = null;
let animTimeout1 = null;
let animTimeout2 = null;

function setupStringChallenge(stringStage) {
    const heartStart = document.getElementById('heartStart');
    const photoLeft = document.getElementById('photoCardLeft');
    const photoRight = document.getElementById('photoCardRight');
    const leftString = document.getElementById('loveStringLeft');
    const rightString = document.getElementById('loveStringRight');
    const seasonMessage = document.getElementById('seasonMessage');
    const mergedHeartContainer = document.getElementById('mergedHeartContainer');

    if (!heartStart || !photoLeft || !photoRight || !leftString || !rightString) {
        return;
    }

    function centerOf(element) {
        const rect = element.getBoundingClientRect();
        const stageRect = stringStage.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - stageRect.left,
            y: rect.top + rect.height / 2 - stageRect.top
        };
    }

    function buildCurve(start, end, lift) {
        const controlX = (start.x + end.x) / 2;
        const controlY = (start.y + end.y) / 2 + lift;
        return `M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`;
    }

    function getHeartCenter() {
        const rect = heartStart.getBoundingClientRect();
        const stageRect = stringStage.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2 - stageRect.left,
            y: rect.top + rect.height / 2 - stageRect.top
        };
    }

    function startMemorySlideshow() {
        const slideshowContainer = document.getElementById('memorySlideshow');
        const captionElement = document.getElementById('memoryCaption');
        if (!slideshowContainer) return;

        slideshowContainer.innerHTML = '';
        currentSlideIndex = 0;

        memoryList.forEach((mem, index) => {
            const img = document.createElement('img');
            img.src = mem.src;
            img.alt = mem.caption;
            img.className = `memory-slide ${index === 0 ? 'active' : ''}`;
            slideshowContainer.appendChild(img);
        });

        if (captionElement && memoryList[0]) {
            captionElement.textContent = memoryList[0].caption;
        }

        if (slideshowTimer) clearInterval(slideshowTimer);

        slideshowTimer = setInterval(() => {
            const slides = slideshowContainer.querySelectorAll('.memory-slide');
            if (!slides || slides.length === 0) return;

            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active');

            if (captionElement && memoryList[currentSlideIndex]) {
                captionElement.style.opacity = '0';
                setTimeout(() => {
                    captionElement.textContent = memoryList[currentSlideIndex].caption;
                    captionElement.style.opacity = '1';
                }, 300);
            }
        }, 2600);
    }

    function spawnHeartBurst() {
        const emojis = ['💖', '💕', '💗', '💓', '✨', '🌸', '🌹', '❤️'];
        for (let i = 0; i < 14; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            heart.style.left = `calc(50% + ${(Math.random() - 0.5) * 150}px)`;
            heart.style.top = `calc(50% + ${(Math.random() - 0.5) * 120}px)`;
            heart.style.fontSize = `${Math.random() * 1.1 + 1}rem`;
            heart.style.setProperty('--tx', `${(Math.random() - 0.5) * 120}px`);
            stringStage.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 2800);
        }
    }

    function connectHeart() {
        const heartCenter = getHeartCenter();
        const leftEnd = centerOf(photoLeft);
        const rightEnd = centerOf(photoRight);

        leftString.setAttribute('d', buildCurve(heartCenter, {
            x: leftEnd.x - 10,
            y: leftEnd.y + 12
        }, -72));

        rightString.setAttribute('d', buildCurve(heartCenter, {
            x: rightEnd.x + 10,
            y: rightEnd.y - 12
        }, 72));

        // Step 1: Reveal Photos & Connect String
        stringStage.classList.add('is-connected');

        // Step 2: Slide Photos toward the center (merging)
        animTimeout1 = setTimeout(() => {
            stringStage.classList.add('is-merging');
        }, 800);

        // Step 3: Morph into Glowing Heart & Start Memory Slideshow
        animTimeout2 = setTimeout(() => {
            stringStage.classList.add('is-merged');
            if (seasonMessage) {
                seasonMessage.classList.add('is-unlocked');
                seasonMessage.setAttribute('aria-hidden', 'false');
            }
            startMemorySlideshow();
            spawnHeartBurst();
            if (heartBurstTimer) clearInterval(heartBurstTimer);
            heartBurstTimer = setInterval(spawnHeartBurst, 3500);
        }, 2000);
    }

    function resetHeart() {
        if (slideshowTimer) clearInterval(slideshowTimer);
        if (heartBurstTimer) clearInterval(heartBurstTimer);
        if (animTimeout1) clearTimeout(animTimeout1);
        if (animTimeout2) clearTimeout(animTimeout2);

        stringStage.classList.remove('is-connected', 'is-merging', 'is-merged');
        leftString.setAttribute('d', '');
        rightString.setAttribute('d', '');

        if (seasonMessage) {
            seasonMessage.classList.remove('is-unlocked');
            seasonMessage.setAttribute('aria-hidden', 'true');
        }
    }

    heartStart.addEventListener('click', () => {
        if (stringStage.classList.contains('is-connected')) {
            resetHeart();
            return;
        }
        connectHeart();
    });

    if (mergedHeartContainer) {
        mergedHeartContainer.addEventListener('click', () => {
            spawnHeartBurst();
        });
    }

    resetHeart();
}

function moveButton() {
    const btnNo = document.getElementById('btnNo');
    if (!btnNo) {
        return;
    }

    btnNo.style.position = 'fixed';

    const maxX = Math.max(0, window.innerWidth - btnNo.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - btnNo.offsetHeight);
    const randomX = Math.floor(Math.random() * (maxX + 1));
    const randomY = Math.floor(Math.random() * (maxY + 1));

    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
}

function showSurprise() {
    const surprise = document.getElementById('surprise');
    const questionSection = document.getElementById('questionSection');

    if (questionSection) {
        questionSection.style.display = 'none';
    }

    if (!surprise.classList.contains('show')) {
        surprise.style.display = 'block';
        setTimeout(() => {
            surprise.classList.add('show');
        }, 10);

        createConfetti();
    }
}

function createConfetti() {
    const flowerItems = ['🌹', '🌸', '🌺', '🌷', '🌻'];
    const colors = ['#d53447', '#ff69b4', '#ffb6c1', '#ffc0cb', '#c21e56'];

    for (let i = 0; i < 180; i++) {
        const item = document.createElement('div');
        item.classList.add('confetti');

        const left     = Math.random() * 100;
        const delay    = Math.random() * 3.5;
        const duration = Math.random() * 2.5 + 2;
        const size     = Math.random() * 1.2 + 0.9;
        const flower   = flowerItems[Math.floor(Math.random() * flowerItems.length)];
        const color    = colors[Math.floor(Math.random() * colors.length)];

        item.style.left            = `${left}%`;
        item.style.position        = 'fixed';
        item.style.top             = '-50px';
        item.style.backgroundColor = 'transparent';
        item.style.width           = 'auto';
        item.style.height          = 'auto';
        item.style.fontSize        = `${size}rem`;
        item.style.color           = color;
        item.style.animation       = `fall ${duration}s linear ${delay}s forwards`;
        item.style.textShadow      = `0 0 8px ${color}`;
        item.style.pointerEvents   = 'none';
        item.style.zIndex          = '1000';

        item.innerText = flower;

        document.body.appendChild(item);

        setTimeout(() => {
            item.remove();
        }, (duration + delay) * 1000);
    }
}

/* ==========================================================================
   CUPID INTRO ANIMATION, CANVAS STARFIELD & PASSWORD LOGIC
   ========================================================================== */
let cupidAnimTimeout1 = null;
let cupidAnimTimeout2 = null;
let cupidAnimTimeout3 = null;
let cupidAnimTimeout4 = null;
let starCanvasAnimId = null;

function initCupidIntro() {
    const cupidIntroOverlay = document.getElementById('cupidIntroOverlay');
    if (!cupidIntroOverlay) return;

    initStarfieldCanvas();

    if (sessionStorage.getItem('cupid_unlocked') === 'true') {
        cupidIntroOverlay.classList.add('unlocked');
        cupidIntroOverlay.style.display = 'none';
        return;
    }

    runCupidAnimation();
}

/* Starfield Canvas Background Animation */
function initStarfieldCanvas() {
    const canvas = document.getElementById('cupidStarCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stars = [];
    const numStars = Math.floor(Math.min(window.innerWidth, 1200) / 12);

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            radius: Math.random() * 2 + 0.8,
            color: Math.random() > 0.4 ? '#ffd700' : (Math.random() > 0.5 ? '#ffb6c1' : '#ffffff'),
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005,
            dy: Math.random() * 0.3 + 0.1
        });
    }

    function renderStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0.2) {
                star.speed = -star.speed;
            }
            star.y -= star.dy;
            if (star.y < 0) {
                star.y = canvas.height;
                star.x = Math.random() * canvas.width;
            }

            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = Math.abs(Math.sin(star.alpha));
            ctx.shadowBlur = star.radius * 3;
            ctx.shadowColor = star.color;
            ctx.fill();
        });

        starCanvasAnimId = requestAnimationFrame(renderStars);
    }

    if (starCanvasAnimId) cancelAnimationFrame(starCanvasAnimId);
    renderStars();
}

/* Web Audio Synthesizer for Romantic Sound Effects */
function playArrowSwooshSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        // Audio playback restricted by browser policy
    }
}

function playHeartUnlockSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

            gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.6);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + idx * 0.1);
            osc.stop(ctx.currentTime + idx * 0.1 + 0.6);
        });
    } catch (e) {
        // Audio playback restricted by browser policy
    }
}

function skipToPasswordStage() {
    const stage = document.getElementById('cupidAnimationStage');
    const passStage = document.getElementById('passwordStage');
    const passInput = document.getElementById('lovePasscode');

    if (!stage || !passStage) return;

    clearTimeout(cupidAnimTimeout1);
    clearTimeout(cupidAnimTimeout2);
    clearTimeout(cupidAnimTimeout3);
    clearTimeout(cupidAnimTimeout4);

    stage.classList.add('fade-out');
    passStage.classList.add('active');
    if (passInput) passInput.focus();
}

function runCupidAnimation() {
    const overlay = document.getElementById('cupidIntroOverlay');
    const stage = document.getElementById('cupidAnimationStage');
    const passStage = document.getElementById('passwordStage');
    const arrow = document.getElementById('flyingArrowSvg');
    const boyTarget = document.getElementById('targetBoyHero');
    const statusText = document.getElementById('statusTextContent');
    const statusIcon = document.getElementById('statusIcon');
    const errorMsg = document.getElementById('passErrorMsg');
    const passInput = document.getElementById('lovePasscode');
    const heartLock = document.getElementById('targetHeartLock');
    const bowString = document.getElementById('bowString');

    if (!overlay || !stage || !passStage) return;

    clearTimeout(cupidAnimTimeout1);
    clearTimeout(cupidAnimTimeout2);
    clearTimeout(cupidAnimTimeout3);
    clearTimeout(cupidAnimTimeout4);

    overlay.style.display = 'flex';
    overlay.classList.remove('unlocked');
    stage.classList.remove('fade-out', 'is-shooting');
    passStage.classList.remove('active');
    if (arrow) arrow.classList.remove('shooting');
    if (boyTarget) boyTarget.classList.remove('hit');

    if (heartLock) {
        heartLock.innerHTML = '<span class="heart-emoji">💖</span>';
    }
    if (bowString) {
        bowString.setAttribute('d', 'M 110 35 L 110 125');
    }

    if (statusIcon) statusIcon.textContent = "🏹";
    if (statusText) statusText.textContent = "Cupid is taking aim at Manooj's heart...";
    if (errorMsg) errorMsg.textContent = "";
    if (passInput) passInput.value = "";

    // Phase 1: Draw Bow String
    cupidAnimTimeout1 = setTimeout(() => {
        stage.classList.add('is-shooting');
        if (bowString) {
            bowString.setAttribute('d', 'M 110 35 Q 85 80 110 125');
        }
        if (statusText) statusText.textContent = "Cupid is drawing the golden bow...";
    }, 400);

    // Phase 2: Shoot Flying Arrow
    cupidAnimTimeout2 = setTimeout(() => {
        if (bowString) {
            bowString.setAttribute('d', 'M 110 35 L 110 125');
        }
        if (arrow) arrow.classList.add('shooting');
        if (statusIcon) statusIcon.textContent = "✨";
        if (statusText) statusText.textContent = "Golden arrow shot with love!";
        playArrowSwooshSound();
    }, 1200);

    // Phase 3: Impact & Heart Unlock
    cupidAnimTimeout3 = setTimeout(() => {
        if (boyTarget) boyTarget.classList.add('hit');
        if (heartLock) {
            heartLock.innerHTML = '<span class="heart-emoji">🔓</span>';
        }
        if (statusIcon) statusIcon.textContent = "💘";
        if (statusText) statusText.textContent = "Bullseye! Manooj's heart unlocked for YEDI!";
        playHeartUnlockSound();
        spawnHeartBurstAtTarget(boyTarget);
    }, 2400);

    // Phase 4: Transition to Password Screen
    cupidAnimTimeout4 = setTimeout(() => {
        stage.classList.add('fade-out');
        setTimeout(() => {
            passStage.classList.add('active');
            if (passInput) passInput.focus();
        }, 500);
    }, 4500);
}

function spawnHeartBurstAtTarget(targetElement) {
    if (!targetElement) return;
    const rect = targetElement.getBoundingClientRect();
    const emojis = ['💖', '💕', '💘', '💗', '✨', '🌹', '👑', '💛'];

    for (let i = 0; i < 24; i++) {
        const p = document.createElement('div');
        p.className = 'floating-heart';
        p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        p.style.position = 'fixed';
        p.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 60}px`;
        p.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 60}px`;
        p.style.fontSize = `${Math.random() * 1.3 + 1}rem`;
        p.style.setProperty('--tx', `${(Math.random() - 0.5) * 160}px`);
        p.style.zIndex = '10005';
        document.body.appendChild(p);

        setTimeout(() => p.remove(), 2600);
    }
}

function handlePasswordSubmit(event) {
    if (event) event.preventDefault();

    const passInput = document.getElementById('lovePasscode');
    const errorMsg = document.getElementById('passErrorMsg');
    const lockCard = document.querySelector('.lock-card');
    const overlay = document.getElementById('cupidIntroOverlay');

    if (!passInput) return;

    const val = passInput.value.trim().toLowerCase();
    const validPasswords = ['2104','manoojyedi',];

    if (validPasswords.includes(val)) {
        if (errorMsg) errorMsg.textContent = "";
        sessionStorage.setItem('cupid_unlocked', 'true');
        
        if (overlay) {
            overlay.classList.add('unlocked');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 600);
        }

        playHeartUnlockSound();
        createConfetti();
    } else {
        if (lockCard) {
            lockCard.classList.remove('shake');
            void lockCard.offsetWidth;
            lockCard.classList.add('shake');
        }
        if (errorMsg) {
            errorMsg.textContent = "Incorrect passcode! Try again 💕";
        }
    }
}

function togglePassVisibility() {
    const passInput = document.getElementById('lovePasscode');
    const btnToggle = document.getElementById('btnTogglePass');

    if (!passInput) return;

    if (passInput.type === 'password') {
        passInput.type = 'text';
        if (btnToggle) btnToggle.textContent = '🙈';
    } else {
        passInput.type = 'password';
        if (btnToggle) btnToggle.textContent = '👁️';
    }
}

function playCupidIntro() {
    sessionStorage.removeItem('cupid_unlocked');
    const overlay = document.getElementById('cupidIntroOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.remove('unlocked');
    }
    runCupidAnimation();
}


