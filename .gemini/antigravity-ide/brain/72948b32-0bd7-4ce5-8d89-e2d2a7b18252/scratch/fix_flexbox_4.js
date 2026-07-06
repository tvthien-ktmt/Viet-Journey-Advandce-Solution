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

let fixedCount = 0;

walkDir(srcDir, (f) => {
  if (!f.endsWith('.tsx') || f.includes('.test.')) return;
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // We want to match <Button ...> ... </Button> or <Link ...> ... </Link> or <button ...> ... </button>
  // that contains an icon (e.g., <Home, <Search, <svg) and some text, but doesn't have `flex` in className.
  
  content = content.replace(/(<(Button|button|Link)[^>]*>)([\s\S]*?)(<\/\2>)/g, (match, openTag, tag, inner, closeTag) => {
    if (openTag.includes('absolute') || openTag.includes('flex')) return match;
    
    // Check if it has an icon
    if (inner.includes('<svg') || inner.match(/<[A-Z][A-Za-z]+(?=\s|>)/)) {
      // Check if it has text
      let text = inner.replace(/<[^>]+>/g, '').trim();
      if (text.length > 0 && !text.includes('{')) {
        // It has text and icon!
        if (openTag.includes('className="')) {
          openTag = openTag.replace('className="', 'className="flex items-center gap-2 ');
        } else if (openTag.includes("className={'")) {
          openTag = openTag.replace("className={'", "className={'flex items-center gap-2 ");
        } else if (openTag.includes('className={`')) {
          openTag = openTag.replace('className={`', 'className={`flex items-center gap-2 ');
        } else {
          // No className
          openTag = openTag.replace('>', ' className="flex items-center gap-2">');
        }
        
        // Also ensure the icon inside has flex-shrink-0
        // e.g., <Plane className="..." /> -> <Plane className="... flex-shrink-0" />
        inner = inner.replace(/(<([A-Z][A-Za-z]+|svg)[^>]*className=["'`])([^"'`]*)(["'`])/g, (m, p1, p2, p3, p4) => {
          if (!p3.includes('flex-shrink-0') && !p3.includes('shrink-0')) {
            return `${p1}${p3} shrink-0${p4}`;
          }
          return m;
        });
        
        return openTag + inner + closeTag;
      }
    }
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(f, content);
    console.log('Fixed Flexbox in', f);
    fixedCount++;
  }
});

console.log('Total files fixed for flexbox:', fixedCount);
