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

let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // We find buttons that have icons inside.
  // A button might look like: <button className="some classes" onClick={...}> <Icon /> Text </button>
  // Let's match `<button` or `<Button` or `<Link` or `<a` tag.
  const tags = ['button', 'Button', 'a', 'Link'];

  tags.forEach(tag => {
    const regex = new RegExp(`(<${tag}[\\s\\S]*?>)([\\s\\S]*?)<\\/${tag}>`, 'g');
    content = content.replace(regex, (match, openTag, innerHtml) => {
      // Check if it has an icon
      const hasIcon = /<[A-Z][A-Za-z]+(?=\s+(?:className|size|color))/.test(innerHtml) || /<svg/.test(innerHtml);
      
      if (!hasIcon) return match;

      // Ensure it doesn't already have flex
      if (openTag.includes('flex') && openTag.includes('items-center')) return match;
      if (openTag.includes('absolute')) return match; // don't mess with absolute positioned buttons
      if (innerHtml.includes('absolute')) return match; // if icon is absolute
      
      // If it has text (we don't want to mess with icon-only buttons for this rule)
      const textContent = innerHtml.replace(/<[^>]*>/g, '').trim();
      // If text content is empty or very short, it might be an icon-only button (e.g., just spaces).
      // Also ignore if it contains curly braces (dynamic text might be missed by plain regex, but we will guess).
      // Wait, let's just check if there is a text node.
      const hasText = textContent.length > 0 || /\{[^\}]+\}/.test(innerHtml);
      if (!hasText) {
        // Icon-only button. Group 10 says they need aria-label! We can check that later.
        return match;
      }

      // We need to inject `flex items-center gap-2` into className.
      if (openTag.includes('className="')) {
        return openTag.replace('className="', 'className="flex items-center gap-2 ') + innerHtml + `</${tag}>`;
      } else if (openTag.includes("className={'")) {
        return openTag.replace("className={'", "className={'flex items-center gap-2 ") + innerHtml + `</${tag}>`;
      } else if (openTag.includes('className={`')) {
        return openTag.replace('className={`', 'className={`flex items-center gap-2 ') + innerHtml + `</${tag}>`;
      } else if (openTag.includes('className={cn(')) {
        return openTag.replace('className={cn(', 'className={cn("flex items-center gap-2", ') + innerHtml + `</${tag}>`;
      } else {
        // No className found, add it.
        return openTag.replace(new RegExp(`(<${tag})`), `$1 className="flex items-center gap-2"`) + innerHtml + `</${tag}>`;
      }
    });
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated buttons in ${file}`);
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} files.`);
