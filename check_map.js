const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\yhwu0\\spaceship game\\script.js', 'utf8');

const mapDataMatch = content.match(/const MAP_DATA = \[\s*([\s\S]*?)\s*\];/);
if (!mapDataMatch) {
    console.error("Could not find MAP_DATA");
    process.exit(1);
}

const mapStr = `[${mapDataMatch[1]}]`;
const MAP_DATA = eval(mapStr);

const ROWS = 18;
const COLUMNS = 48; // since width is 2880 / 60 = 48

for (let r = 0; r < ROWS; r++) {
    let rowDisplay = "";
    for (let c = 0; c < COLUMNS; c++) {
        let val = MAP_DATA[r][c];
        if (val === 1) rowDisplay += "1"; // Wall
        else if (val === 2) rowDisplay += "S"; // Start
        else if (val === 3) rowDisplay += "E"; // End
        else if (val === 4) rowDisplay += "T"; // Teleporter
        else rowDisplay += "."; // Path
    }
    console.log(rowDisplay);
}
