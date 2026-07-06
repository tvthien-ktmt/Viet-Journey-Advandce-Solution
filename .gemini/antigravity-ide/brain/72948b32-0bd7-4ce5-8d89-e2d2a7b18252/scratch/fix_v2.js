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

let updatedFiles = 0;

walkDir(srcDir, (f) => {
  if (!f.endsWith('.tsx') && !f.endsWith('.ts')) return;
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;

  // Group 2: Border Radius
  // Buttons -> rounded-lg
  content = content.replace(/(<Button[^>]*?className=(['"`]))([^'"`]*?)(\2)/g, (match, p1, p2, classNames, p4) => {
    let newClasses = classNames.replace(/rounded-(sm|md|xl|2xl|none|full)/g, '').trim();
    if (!newClasses.includes('rounded-lg')) {
      newClasses += ' rounded-lg';
    }
    // Clean up double spaces
    newClasses = newClasses.replace(/\s+/g, ' ');
    return `${p1}${newClasses}${p4}`;
  });

  // Inputs, Selects -> rounded-lg
  content = content.replace(/(<(?:Input|SelectTrigger|input|select)[^>]*?className=(['"`]))([^'"`]*?)(\2)/g, (match, p1, p2, classNames, p4) => {
    let newClasses = classNames.replace(/rounded-(sm|md|xl|2xl|none|full)/g, '').trim();
    if (!newClasses.includes('rounded-lg')) {
      newClasses += ' rounded-lg';
    }
    newClasses = newClasses.replace(/\s+/g, ' ');
    return `${p1}${newClasses}${p4}`;
  });

  // Dialog/Modal -> rounded-2xl
  content = content.replace(/(<DialogContent[^>]*?className=(['"`]))([^'"`]*?)(\2)/g, (match, p1, p2, classNames, p4) => {
    let newClasses = classNames.replace(/rounded-(sm|md|lg|xl|none|full)/g, '').trim();
    if (!newClasses.includes('rounded-2xl')) {
      newClasses += ' rounded-2xl';
    }
    newClasses = newClasses.replace(/\s+/g, ' ');
    return `${p1}${newClasses}${p4}`;
  });

  // Cards -> rounded-xl
  content = content.replace(/(<Card[^>]*?className=(['"`]))([^'"`]*?)(\2)/g, (match, p1, p2, classNames, p4) => {
    let newClasses = classNames.replace(/rounded-(sm|md|lg|2xl|none|full)/g, '').trim();
    if (!newClasses.includes('rounded-xl')) {
      newClasses += ' rounded-xl';
    }
    newClasses = newClasses.replace(/\s+/g, ' ');
    return `${p1}${newClasses}${p4}`;
  });

  // Group 4: Typography
  // Replace text-black, text-gray-900 with text-vna-text (which is #0b1f3a)
  content = content.replace(/\btext-black\b/g, 'text-vna-text');
  content = content.replace(/\btext-gray-900\b/g, 'text-vna-text');
  content = content.replace(/\btext-slate-900\b/g, 'text-vna-text');
  // text-gray-500 -> text-slate-500 (standardized muted text)
  content = content.replace(/\btext-gray-500\b/g, 'text-slate-500');

  // Group 6: Responsive Grid
  // Find grid-cols-[2-9] not preceded by md:|lg:|sm: and prefix with md:
  content = content.replace(/(?<!(md:|lg:|sm:|xl:))grid-cols-([2-9])/g, 'grid-cols-1 md:grid-cols-$2');

  if (content !== originalContent) {
    fs.writeFileSync(f, content);
    console.log('Fixed V2 groups in ' + f);
    updatedFiles++;
  }
});

console.log(`Updated ${updatedFiles} files for Vòng 2.`);
