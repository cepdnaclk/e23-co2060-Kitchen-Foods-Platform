const fs = require('fs');
const path = require('path');

const filesToProcess = [
    'src/App.tsx',
    'src/components/MenuCustomization.tsx',
    'src/components/RequestForm.tsx',
    'src/index.css'
];

filesToProcess.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Base replacements
    content = content.replace(/bg-brand-dark/g, 'bg-brand-cream');

    // Replace text-white globally first
    content = content.replace(/text-white/g, 'text-stone-900');

    // Opacities and borders
    content = content.replace(/border-white\//g, 'border-stone-900/');
    content = content.replace(/bg-white\//g, 'bg-stone-900/');
    content = content.replace(/hover:bg-white/g, 'hover:bg-stone-900');
    content = content.replace(/hover:text-black/g, 'hover:text-white');

    // Update glassmorphism RGBA values
    content = content.replace(/255, 255, 255/g, '0, 0, 0');

    // Try to restore text-white for primary buttons
    content = content.replace(/bg-brand-primary([\s\w\-]+)text-stone-900/g, 'bg-brand-primary$1text-white');
    content = content.replace(/text-stone-900([\s\w\-]+)bg-brand-primary/g, 'text-white$1bg-brand-primary');

    fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Light theme preview applied.');
