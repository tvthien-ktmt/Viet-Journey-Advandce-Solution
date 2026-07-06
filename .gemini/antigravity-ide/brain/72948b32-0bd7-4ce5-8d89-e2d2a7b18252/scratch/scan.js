const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('D:/Viet Journey Advandce Solution/frontend/src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const files = [];
walkDir(srcDir, (f) => {
  if (f.endsWith('.tsx') && !f.includes('.test.') && !f.includes('node_modules')) {
    files.push(f);
  }
});

let report = {
  group1_button_alignment: [],
  group2_border_radius: [],
  group3_hardcoded_colors: [],
  group4_typography: [],
  group8_forms: [],
  group10_a11y: [],
};

const buttonRegex = /<(?:button|Button)[^>]*>([\s\S]*?)<\/(?:button|Button)>/g;
const iconRegex = /<[A-Z][A-Za-z]+(?=\s+(?:className|size))/;
const hexRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
const allowedHex = ['023a78', 'f5a623', '1f6fb2', 'd4111a', 'eaf3fb', 'ffffff', '000000', '64748b', 'e2e8f0', '0b1f3a', 'ffd66b', 'd4891a'].map(c => c.toLowerCase());
const imgRegex = /<img([^>]*)\/?>/g;
const aRegex = /<a[^>]*>([\s\S]*?)<\/a>/g;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const relPath = path.relative(srcDir, file);

  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const innerHtml = match[1];
    if (iconRegex.test(innerHtml) && !fullTag.includes('flex') && !fullTag.includes('items-center') && !fullTag.includes('absolute')) {
      report.group1_button_alignment.push(`${relPath}: Button with icon missing flex items-center`);
    }
  }

  while ((match = aRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const innerHtml = match[1];
    if (iconRegex.test(innerHtml) && !fullTag.includes('flex') && !fullTag.includes('items-center') && !fullTag.includes('absolute')) {
      report.group1_button_alignment.push(`${relPath}: Link with icon missing flex items-center`);
    }
  }

  while ((match = hexRegex.exec(content)) !== null) {
    const hex = match[1].toLowerCase();
    if (!allowedHex.includes(hex)) {
      if (!report.group3_hardcoded_colors.includes(`${relPath}: Invalid hex color #${hex}`)) {
        report.group3_hardcoded_colors.push(`${relPath}: Invalid hex color #${hex}`);
      }
    }
  }

  while ((match = imgRegex.exec(content)) !== null) {
    if (!match[1].includes('alt=')) {
      report.group10_a11y.push(`${relPath}: <img> missing alt attribute`);
    }
  }
});

fs.writeFileSync('D:/Viet Journey Advandce Solution/.gemini/antigravity-ide/brain/72948b32-0bd7-4ce5-8d89-e2d2a7b18252/scratch/report.json', JSON.stringify(report, null, 2));
console.log("Report generated.");
