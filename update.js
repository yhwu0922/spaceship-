const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// 1. Map Data
let mapMatches = code.match(/const MAP_DATA = \[([\s\S]*?)\];/);
if (mapMatches) {
    let mapStr = mapMatches[1];
    let lines = mapStr.split('\n');
    let matrix = [];
    for (let i = 0; i < lines.length; i++) {
        let l = lines[i].trim();
        if (l.endsWith(',')) l = l.slice(0, -1);
        if (!l) continue;
        matrix.push(eval(l));
    }

    // insert 4 at random 0s
    let zeros = [];
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[0].length; c++) {
            if (matrix[r][c] === 0) zeros.push({ r, c });
        }
    }

    // deterministic picks spread out
    let picks = [zeros[15], zeros[Math.floor(zeros.length * 0.33)], zeros[Math.floor(zeros.length * 0.66)], zeros[zeros.length - 15]];
    for (let p of picks) matrix[p.r][p.c] = 4;

    // build output
    let out = 'const MAP_DATA = [\n';
    for (let r = 0; r < matrix.length; r++) {
        out += '    [' + matrix[r].join(', ') + ']' + (r === matrix.length - 1 ? '' : ',') + '\n';
    }
    out += '];';

    code = code.replace(mapMatches[0], out);
}

// 2. Global vars
code = code.replace(
    'let walls = [];\nlet spawnX = 0, spawnY = 0;',
    'let walls = [];\nlet teleporters = [];\nlet teleportCooldown = 0;\nlet spawnX = 0, spawnY = 0;'
);

// 3. initMap
code = code.replace(
    '} else if (val === 3) {\n                targetX = x;\n                targetY = y;\n            }',
    '} else if (val === 3) {\n                targetX = x;\n                targetY = y;\n            } else if (val === 4) {\n                teleporters.push({ x: x + TILE_SIZE / 2, y: y + TILE_SIZE / 2, width: TILE_SIZE, height: TILE_SIZE });\n            }'
);

// 4. update loop
const updateTarget = `    // Check Win Condition (overlap with Portal)
    const portalRect = { x: targetX + TILE_SIZE / 2, y: targetY + TILE_SIZE / 2, width: TILE_SIZE, height: TILE_SIZE };
    if (checkOverlap(player, portalRect)) {
        winGame(elapsed);
    }`;

const updateRepl = `    // Check Win Condition (overlap with Portal)
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
                    teleportCooldown = 2000;
                    
                    flashOverlay.classList.add('flash-active');
                    flashOverlay.style.transition = 'none';
                    flashOverlay.style.backgroundColor = 'rgba(0, 255, 255, 0.4)';
                    setTimeout(() => {
                        flashOverlay.style.transition = 'background-color 0.1s ease-out';
                        flashOverlay.style.backgroundColor = 'rgba(255, 0, 0, 0)';
                        flashOverlay.classList.remove('flash-active');
                    }, 100);
                }
                break;
            }
        }
    }`;
code = code.replace(updateTarget, updateRepl);

// 5. Draw
const drawTarget = `    for (let wall of walls) {
        // We can draw emoji '🪨' or just a block
        ctx.fillText('🪨', wall.x + wall.width / 2, wall.y + wall.height / 2 + 5);
    }`;
const drawRepl = `    for (let wall of walls) {
        // We can draw emoji '🪨' or just a block
        ctx.fillText('🪨', wall.x + wall.width / 2, wall.y + wall.height / 2 + 5);
    }

    ctx.font = \`\${TILE_SIZE * 0.9}px Arial\`;
    for (let t of teleporters) {
        ctx.fillText('🌀', t.x, t.y + 5); // wait, target is 🌀. Let's use 🌌 for teleporter
    }
    ctx.font = \`\${TILE_SIZE * 0.8}px Arial\`;`;
code = code.replace(drawTarget, drawRepl.replace('🌀', '🌌'));

fs.writeFileSync('script.js', code);
console.log("SUCCESS Node");
