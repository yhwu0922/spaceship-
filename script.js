const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const timerEl = document.getElementById('timer');
const flashOverlay = document.getElementById('flash-overlay');
const endScreen = document.getElementById('end-screen');
const finalTimeEl = document.getElementById('final-time');
const restartBtn = document.getElementById('restart-btn');
const toggleEditorBtn = document.getElementById('toggle-editor-btn');
const exportMapBtn = document.getElementById('export-map-btn');

const startScreen = document.getElementById('start-screen');
const playerIdInput = document.getElementById('player-id-input');
const startBtn = document.getElementById('start-btn');
const leaderboardList = document.getElementById('leaderboard-list');

let currentPlayerId = "Anonymous";
const LEADERBOARD_KEY = 'space_maze_leaderboard';

// Game Constants
const TILE_SIZE = 60;
const CANVAS_WIDTH = 3840;
const CANVAS_HEIGHT = 1080;
const COLUMNS = CANVAS_WIDTH / TILE_SIZE; // 32
const ROWS = CANVAS_HEIGHT / TILE_SIZE;   // 18

// 0: path, 1: wall, 2: start, 3: end
const MAP_DATA = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 4, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Input handling
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});

restartBtn.addEventListener('click', () => {
    resetGame(true);
});

startBtn.addEventListener('click', () => {
    const name = playerIdInput.value.trim();
    currentPlayerId = name ? name : "Anonymous";
    startGame();
});

// ------------ EDITOR LOGIC ------------
let isEditing = false;
let isDragging = false;
let drawMode = 1; // 1 to draw wall, 0 to erase wall

toggleEditorBtn.addEventListener('click', () => {
    isEditing = !isEditing;
    if (isEditing) {
        // Enter edit mode
        gameState = 'editing';
        toggleEditorBtn.innerText = '退出編輯模式';
        exportMapBtn.classList.remove('hidden');
        timerEl.style.opacity = '0.5';
    } else {
        // Exit edit mode, reset game
        toggleEditorBtn.innerText = '進入編輯模式';
        exportMapBtn.classList.add('hidden');
        timerEl.style.opacity = '1';
        resetGame(true);
    }
});

exportMapBtn.addEventListener('click', () => {
    let str = "const MAP_DATA = [\n";
    for (let r = 0; r < ROWS; r++) {
        str += "    [" + MAP_DATA[r].join(", ") + "]" + (r === ROWS - 1 ? "" : ",") + "\n";
    }
    str += "];";
    console.log(str);
    alert("地圖陣列已輸出至瀏覽器 Console！(F12)");
});

function handleEditMove(e) {
    if (!isEditing || !isDragging) return;
    updateMapDataFromMouse(e);
}

function handleEditDown(e) {
    if (!isEditing) return;
    isDragging = true;

    // Determine whether to draw or erase based on button clicked
    // 0 = left click (draw), 2 = right click (erase)
    if (e.button === 2) {
        drawMode = 0;
    } else {
        drawMode = 1;
    }
    updateMapDataFromMouse(e);
}

function handleEditUp(e) {
    if (!isEditing) return;
    isDragging = false;
}

function updateMapDataFromMouse(e) {
    // Prevent context menu on right click dragging
    if (e.cancelable) e.preventDefault();

    // Calculate precise mouse offset relative to actual displayed canvas size
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const c = Math.floor(x / TILE_SIZE);
    const r = Math.floor(y / TILE_SIZE);

    // Validate bounds
    if (r >= 0 && r < ROWS && c >= 0 && c < COLUMNS) {
        // Protect spawn (2) and portal (3) from being overwritten if possible
        if (MAP_DATA[r][c] !== 2 && MAP_DATA[r][c] !== 3) {
            MAP_DATA[r][c] = drawMode;
            initMap(); // Re-parse map instantly to update walls array
        }
    }
}

canvas.addEventListener('mousedown', handleEditDown);
canvas.addEventListener('mousemove', handleEditMove);
window.addEventListener('mouseup', handleEditUp);
canvas.addEventListener('contextmenu', (e) => {
    if (isEditing) e.preventDefault();
});
// --------------------------------------

// Game State
let gameState = 'start'; // start, playing, end
let startScreenTime = 0;
let gameStartTime = 0;
let elapsedAtDeath = 0; // retain time when dying
let lastTime = 0;

let walls = [];
let teleporters = [];
let teleportCooldown = 0;
let spawnX = 0, spawnY = 0;
let targetX = 0, targetY = 0;

let player = {
    x: 0,
    y: 0,
    width: 36,
    height: 36,
    speed: 350, // pixels per sec
    isGiant: false
};

let enemies = [];

// Initialize map walls and spawn points
function initMap() {
    walls = [];
    teleporters = [];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLUMNS; c++) {
            const val = MAP_DATA[r][c];
            const x = c * TILE_SIZE;
            const y = r * TILE_SIZE;
            if (val === 1) {
                walls.push({ x, y, width: TILE_SIZE, height: TILE_SIZE });
            } else if (val === 2) {
                spawnX = x + TILE_SIZE / 2;
                spawnY = y + TILE_SIZE / 2;
            } else if (val === 3) {
                targetX = x;
                targetY = y;
            } else if (val === 4) {
                teleporters.push({ x: x + TILE_SIZE / 2, y: y + TILE_SIZE / 2, width: TILE_SIZE, height: TILE_SIZE });
            }
        }
    }

    // Add dynamic meteors
    addEnemies();
}

function addEnemies() {
    enemies = [];
    // Provide a few patrolling enemy definitions
    const createEnemy = (startX, startY, vx, vy) => {
        return {
            x: startX * TILE_SIZE + TILE_SIZE / 2,
            y: startY * TILE_SIZE + TILE_SIZE / 2,
            vx, vy,
            width: 30, height: 30,
            emoji: '🔥'
        };
    };

    // Enemy 1: Horizontal patrol in row 1, but there's a bypass route below it in rows 3->5
    enemies.push(createEnemy(10, 1, 200, 0));
    // Enemy 2: Vertical patrol in col 13. Player can use col 11 or 15 to bypass.
    enemies.push(createEnemy(13, 3, 0, 200));
    // Enemy 3: Horizontal patrol in row 7. Player can wait in side gaps in col 11 or 13.
    enemies.push(createEnemy(16, 7, -250, 0));
    // Enemy 4: Horizontal patrol in row 9. Player can loop around via row 11 perfectly.
    enemies.push(createEnemy(10, 9, 300, 0));
    // Enemy 5: Vertical patrol in col 22. Player can use col 24 or 20 to bypass.
    enemies.push(createEnemy(22, 10, 0, -250));
    // Enemy 6: Horizontal patrol in row 15. Player can hold in vertical sections.
    enemies.push(createEnemy(14, 15, -180, 0));
}

function resetGame(fullReset = false) {
    player.x = spawnX;
    player.y = spawnY;
    player.isGiant = false;

    if (fullReset) {
        gameState = 'start';
        elapsedAtDeath = 0;
        gameStartTime = 0;
        endScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        timerEl.innerText = '00:00.000';
        addEnemies(); // reset enemy positions
    }
}

function startGame() {
    if (isEditing) return;
    gameState = 'playing';
    startScreen.classList.add('hidden');
    gameStartTime = performance.now();
}

function update(deltaTime) {
    if (gameState !== 'playing') return;

    // Update Timer
    const now = performance.now();
    const elapsed = elapsedAtDeath + (now - gameStartTime);
    updateTimerText(elapsed);

    // Player Movement
    let dx = 0;
    let dy = 0;
    if (keys.ArrowUp) dy -= player.speed * (deltaTime / 1000);
    if (keys.ArrowDown) dy += player.speed * (deltaTime / 1000);
    if (keys.ArrowLeft) dx -= player.speed * (deltaTime / 1000);
    if (keys.ArrowRight) dx += player.speed * (deltaTime / 1000);

    // Normalize diagonal movement speed
    if (dx !== 0 && dy !== 0) {
        const factor = Math.SQRT1_2;
        dx *= factor;
        dy *= factor;
    }

    // Apply movement with collision and slide
    if (dx !== 0) {
        player.x += dx;
        if (checkWallCollision(player)) {
            player.x -= dx; // Revert
        }
    }
    if (dy !== 0) {
        player.y += dy;
        if (checkWallCollision(player)) {
            player.y -= dy; // Revert
        }
    }

    // Update Enemies
    for (let enemy of enemies) {
        enemy.x += enemy.vx * (deltaTime / 1000);
        enemy.y += enemy.vy * (deltaTime / 1000);

        // Enemy Wall Collision (Bounce)
        if (checkWallCollision(enemy)) {
            // Revert movement and flip velocity
            enemy.x -= enemy.vx * (deltaTime / 1000);
            enemy.y -= enemy.vy * (deltaTime / 1000);
            enemy.vx *= -1;
            enemy.vy *= -1;
        }

        // AABB check player vs enemy
        if (checkOverlap(player, enemy)) {
            killPlayer();
        }
    }

    // Check Win Condition (overlap with Portal)
    const portalRect = { x: targetX + TILE_SIZE / 2, y: targetY + TILE_SIZE / 2, width: TILE_SIZE, height: TILE_SIZE };
    if (checkOverlap(player, portalRect)) {
        winGame(elapsed);
    }

    // Teleporter logic
    if (teleportCooldown > 0) {
        teleportCooldown -= deltaTime;
    } else {
        for (let t of teleporters) {
            if (checkOverlap(player, t)) {
                const otherTeleporters = teleporters.filter(tp => tp !== t);
                if (otherTeleporters.length > 0) {
                    const dest = otherTeleporters[Math.floor(Math.random() * otherTeleporters.length)];
                    player.x = dest.x;
                    player.y = dest.y;
                    teleportCooldown = 1500; // 1.5 seconds cooldown

                    player.isGiant = true;
                    setTimeout(() => {
                        player.isGiant = false;
                    }, 1000);
                }
                break;
            }
        }
    }
}

function checkWallCollision(entity) {
    for (let wall of walls) {
        if (checkOverlap(entity, {
            x: wall.x + wall.width / 2,
            y: wall.y + wall.height / 2,
            width: wall.width,
            height: wall.height
        })) {
            return true;
        }
    }
    return false;
}

// Check overlapping using center x,y and width,height
function checkOverlap(a, b) {
    const aHalfW = a.width / 2;
    const aHalfH = a.height / 2;
    const bHalfW = b.width / 2;
    const bHalfH = b.height / 2;
    return (
        a.x - aHalfW < b.x + bHalfW &&
        a.x + aHalfW > b.x - bHalfW &&
        a.y - aHalfH < b.y + bHalfH &&
        a.y + aHalfH > b.y - bHalfH
    );
}

function killPlayer() {
    // Retain elapsed time
    elapsedAtDeath += (performance.now() - gameStartTime);
    gameStartTime = performance.now();

    // Flash effect
    flashOverlay.classList.add('flash-active');
    setTimeout(() => {
        flashOverlay.classList.remove('flash-active');
    }, 150);

    // Reset position
    player.x = spawnX;
    player.y = spawnY;
    player.isGiant = false;
}

function winGame(finalScoreMs) {
    gameState = 'end';
    updateTimerText(finalScoreMs, finalTimeEl);
    endScreen.classList.remove('hidden');

    saveToLeaderboard(currentPlayerId, finalScoreMs);
    renderLeaderboard();
}

function saveToLeaderboard(name, timeMs) {
    let board = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    board.push({ name, timeMs });
    board.sort((a, b) => a.timeMs - b.timeMs);
    board = board.slice(0, 5);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
}

function renderLeaderboard() {
    const board = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
    leaderboardList.innerHTML = '';
    board.forEach(entry => {
        const li = document.createElement('li');
        const nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        nameSpan.textContent = entry.name;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'time';
        timeSpan.textContent = formatTime(entry.timeMs);

        li.appendChild(nameSpan);
        li.appendChild(timeSpan);
        leaderboardList.appendChild(li);
    });
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const remainingMs = Math.floor(ms % 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(remainingMs).padStart(3, '0')}`;
}

function updateTimerText(ms, el = timerEl) {
    el.innerText = formatTime(ms);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Editor Grid Overlay
    if (gameState === 'editing') {
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        for (let r = 0; r <= ROWS; r++) {
            ctx.beginPath();
            ctx.moveTo(0, r * TILE_SIZE);
            ctx.lineTo(CANVAS_WIDTH, r * TILE_SIZE);
            ctx.stroke();
        }
        for (let c = 0; c <= COLUMNS; c++) {
            ctx.beginPath();
            ctx.moveTo(c * TILE_SIZE, 0);
            ctx.lineTo(c * TILE_SIZE, CANVAS_HEIGHT);
            ctx.stroke();
        }
    }

    // Draw Walls
    ctx.font = `${TILE_SIZE * 0.8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let wall of walls) {
        // We can draw emoji '🪨' or just a block
        ctx.fillText('🪨', wall.x + wall.width / 2, wall.y + wall.height / 2 + 5);
    }

    // Draw Teleporters
    ctx.font = `${TILE_SIZE * 0.9}px Arial`;
    for (let t of teleporters) {
        ctx.fillText('🌌', t.x, t.y + 5);
    }
    ctx.font = `${TILE_SIZE * 0.8}px Arial`;

    // Draw Portal
    ctx.fillText('🌀', targetX + TILE_SIZE / 2, targetY + TILE_SIZE / 2 + 5);

    // Draw Player
    if (player.isGiant) {
        ctx.font = `${TILE_SIZE * 0.8 * 3}px Arial`;
    }
    ctx.fillText('🚀', player.x, player.y + 5);
    if (player.isGiant) {
        ctx.font = `${TILE_SIZE * 0.8}px Arial`; // Reset font
    }
    // Draw Enemies
    for (let enemy of enemies) {
        ctx.fillText(enemy.emoji, enemy.x, enemy.y + 5);
    }

    // Fog of War
    // drawFog();
}

function drawFog() {
    // Overlay entire screen with black
    ctx.globalCompositeOperation = 'source-over';

    // To do this efficiently:
    // We draw black screen, but we "punch a hole" where the player is.
    // However, it's easier to fill a temporary canvas, or use radial gradient.

    // First, fill everything with solid black
    // But we use destination-in/destination-out trick maybe, wait, easiest is to fill everything and then destination-out.
    // Wait, destination-out only removes what was drawn *before*. So we'd remove our game objects!
    // We need to draw the fog on top.

    // Draw the dark overlay
    ctx.fillStyle = '#000000';
    // Instead of simple fillRect, let's use a path that is the whole screen MINUS the player circle

    ctx.beginPath();
    ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.arc(player.x, player.y, 180, 0, Math.PI * 2, true);
    ctx.fill();

    // Now for the gradient soft edge
    const grad = ctx.createRadialGradient(player.x, player.y, 80, player.x, player.y, 180);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(player.x, player.y, 180, 0, Math.PI * 2);
    ctx.fill();
}

function gameLoop(timestamp) {
    // Calculate Delta Time
    let deltaTime = timestamp - lastTime;
    if (deltaTime > 100) deltaTime = 100; // cap delta to avoid massive jumps if tab is inactive
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// Start
initMap();
resetGame(true);
requestAnimationFrame(gameLoop);
