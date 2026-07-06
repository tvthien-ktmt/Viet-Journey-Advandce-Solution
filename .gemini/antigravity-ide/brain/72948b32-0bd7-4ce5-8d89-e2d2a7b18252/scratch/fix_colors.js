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

// Hex mappings for Group 3
const hexMap = {
  'ffd27a': 'vna-gold', // close to #f5a623
  'd98a0e': 'vna-gold',
  'ffe6a8': 'vna-gold',
  'c87f0a': 'vna-gold',
  'b9700a': 'vna-gold',
  'a86608': 'vna-gold',
  'e1eaf4': 'slate-200',
  'dce6f1': 'slate-200',
  'f5f9fd': 'slate-50',
  'f4f7fb': 'slate-50',
  '7a5300': 'yellow-800', // hero search note text
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Group 3 Fixes
  content = content.replace(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/gi, (match, p1) => {
    const hex = p1.toLowerCase();
    if (hexMap[hex]) {
      // It's tricky to replace hex with class name correctly if it's inside bg-[#hex].
      // Instead, we replace the class `bg-[#e1eaf4]` with `bg-slate-200` etc.
      return match; 
    }
    return match;
  });

  // Since regex string replacement for colors is risky, I will explicitly target bg-[#hex], text-[#hex], border-[#hex]
  for (const [hex, cssVar] of Object.entries(hexMap)) {
    content = content.replace(new RegExp(`bg-\\[#${hex}\\]`, 'gi'), `bg-${cssVar}`);
    content = content.replace(new RegExp(`text-\\[#${hex}\\]`, 'gi'), `text-${cssVar}`);
    content = content.replace(new RegExp(`border-\\[#${hex}\\]`, 'gi'), `border-${cssVar}`);
    content = content.replace(new RegExp(`divide-\\[#${hex}\\]`, 'gi'), `divide-${cssVar}`);
  }

  // Also replace some dashboard colors with standard tailwind colors instead of hardcoded hex
  const dashboardColors = {
    '0088fe': 'blue-500',
    '00c49f': 'emerald-500',
    'ffbb28': 'amber-400',
    'ff8042': 'orange-500',
    '3b82f6': 'blue-500',
    '10b981': 'emerald-500',
    '8884d8': 'indigo-400',
    '8b5cf6': 'violet-500',
  };
  
  for (const [hex, cssVar] of Object.entries(dashboardColors)) {
    // These are often in fill="#0088fe" or stroke="#8884d8"
    content = content.replace(new RegExp(`fill="#${hex}"`, 'gi'), `fill="currentColor" className="text-${cssVar}"`);
    content = content.replace(new RegExp(`stroke="#${hex}"`, 'gi'), `stroke="currentColor" className="text-${cssVar}"`);
  }

  // Specific fix for LotusLogo.tsx gradients (they were using stopColor="#hex")
  if (file.includes('LotusLogo.tsx')) {
    content = content.replace(/stopColor="#ffd27a"/gi, 'stopColor="#f5a623"');
    content = content.replace(/stopColor="#d98a0e"/gi, 'stopColor="#d4891a"');
    content = content.replace(/stopColor="#ffe6a8"/gi, 'stopColor="#ffd66b"');
    content = content.replace(/stopColor="#c87f0a"/gi, 'stopColor="#d4891a"');
    content = content.replace(/stopColor="#b9700a"/gi, 'stopColor="#d4891a"');
    content = content.replace(/stopColor="#a86608"/gi, 'stopColor="#d4891a"');
  }

  // Group 1 Fixes (Buttons with icons)
  // We'll search for <button ...> ... </button> or <Button ...> ... </Button>
  // and insert `flex items-center gap-2` if it has text and an icon.
  // Note: doing this via AST is safer. Let's install a tool or just write robust regex.
  // Actually, I'll let the user know I am fixing things with a script.
  // Instead of risking regex on buttons, I'll log all buttons missing aria-label and missing flex.
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated colors in ${file}`);
  }
});
