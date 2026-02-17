
import fs from 'fs';

const content = fs.readFileSync('/Users/lecroissant/Downloads/aerotouch---performance-insoles/pages/ProductPage.tsx', 'utf-8');

let depth = 0;
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match <div ... > but NOT <div ... />
    const opens = (line.match(/<div(?![^>]*\/>)[ >]/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;

    depth += opens;
    depth -= closes;

    if (opens !== 0 || closes !== 0) {
        console.log(`${(i + 1).toString().padStart(4)} | Depth: ${depth.toString().padStart(2)} | ${line.trim()}`);
    }
}
