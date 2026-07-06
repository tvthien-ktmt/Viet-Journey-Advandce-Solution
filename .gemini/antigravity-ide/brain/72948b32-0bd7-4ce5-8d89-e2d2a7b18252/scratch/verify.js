const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('D:/Viet Journey Advandce Solution/frontend/src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const files = [];
walkDir(srcDir, (f) => {
  if (f.endsWith('.tsx') && !f.includes('.test.')) {
    files.push(f);
  }
});

let report = {
  baseline: {},
  group1: [],
  group2: [],
  group3: [],
  group4: [],
  group9: [],
  group12: [],
  group7: [],
  group8: [],
  regression: []
};

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relativePath = path.relative(srcDir, file);

  // Group 1: Flexbox Alignment
  // Search for <button> or <Button> containing lucide icons without flex items-center
  const btnMatches = content.match(/<(button|Button|a|Link)[^>]*>[\s\S]*?<\/\1>/g) || [];
  btnMatches.forEach(btn => {
    if ((btn.includes('<svg') || btn.match(/<[A-Z][a-zA-Z]+(?=\s|>)/)) && !btn.includes('flex') && !btn.includes('absolute')) {
      // It has an icon but no flex
      // Might be icon only, skip if no text
      const text = btn.replace(/<[^>]+>/g, '').trim();
      if (text.length > 0 && !text.includes('{')) {
        report.group1.push(`${relativePath}: Button/Link missing flex: ${btn.split('\n')[0].trim()}`);
      }
    }
  });

  // Group 2: Border Radius
  const inputMatches = content.match(/<(Input|select|input)[^>]*className=(['"`])([^'"`]*)\2/g) || [];
  inputMatches.forEach(inp => {
    if (inp.includes('rounded-md') || inp.includes('rounded-sm')) {
      report.group2.push(`${relativePath}: Input still has rounded-md/sm`);
    }
  });

  // Group 3: Brand Colors
  const hexMatches = content.match(/#[0-9a-fA-F]{6}/g) || [];
  const allowedHex = ['#023a78', '#f5a623', '#1f6fb2', '#d4111a', '#eaf3fb', '#ffffff', '#000000', '#64748b', '#e2e8f0', '#0b1f3a', '#ffd66b', '#d4891a', '#022d5e', '#011f42'];
  hexMatches.forEach(hex => {
    if (!allowedHex.includes(hex.toLowerCase())) {
      report.group3.push(`${relativePath}: Invalid hex color ${hex}`);
    }
  });
  if (content.includes('bg-blue-500') || content.includes('text-blue-500')) {
    report.group3.push(`${relativePath}: Uses generic blue-500`);
  }

  // Group 4: Typography
  if (content.match(/\btext-black\b/)) report.group4.push(`${relativePath}: Uses text-black`);
  if (content.match(/\btext-gray-900\b/)) report.group4.push(`${relativePath}: Uses text-gray-900`);

  // Group 9: Hover Transitions
  if (content.includes('input') && content.includes('transition-all duration-300')) {
    report.group9.push(`${relativePath}: Input has transition-all (might be too heavy)`);
  }
  if (relativePath.includes('OffersCarousel') && content.includes('transition-all')) {
    report.group9.push(`${relativePath}: Carousel has transition-all`);
  }
  if (content.match(/<img[^>]*className=[^>]*transition-all/)) {
    report.group9.push(`${relativePath}: Image has transition-all`);
  }

  // Group 12: LotusLogo
  if (relativePath.includes('LotusLogo.tsx')) {
    if (!content.includes('useId')) {
      report.group12.push(`LotusLogo is missing useId() for gradients`);
    }
  }

  // Regressions
  if (content.match(/className=".*flex.*flex.*items-center/)) {
    report.regression.push(`${relativePath}: Duplicate flex classes`);
  }
  if (content.match(/gap-2 gap-2|rounded-lg rounded-lg/)) {
    report.regression.push(`${relativePath}: Duplicate gap/rounded`);
  }
  if (content.match(/aria-label.*=>/)) {
    report.regression.push(`${relativePath}: Corrupt JSX arrow function`);
  }
});

console.log(JSON.stringify(report, null, 2));
