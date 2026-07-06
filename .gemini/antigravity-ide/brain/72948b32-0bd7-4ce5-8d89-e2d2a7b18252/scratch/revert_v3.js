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

let revertedFiles = 0;

walkDir(srcDir, (f) => {
  if (!f.endsWith('.tsx')) return;
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;

  // The regex was /<([bB]utton|a|Link)([^>]*)>/g
  // And it replaced with `<${tag}${props} aria-label="Interactive Element">`
  // If the original was `onClick={(e) => e.preventDefault()}`
  // It matched `<button ... onClick={(e) =`
  // Then appended ` aria-label="Interactive Element"> e.preventDefault()}`
  // Let's find `= aria-label="Interactive Element">` and turn it back into `=>`
  
  content = content.replace(/=\s*aria-label="Interactive Element">/g, '=>');
  
  // If there are other places where ` aria-label="Interactive Element"` was added and it caused issues?
  // Let's just remove ALL ` aria-label="Interactive Element"` because it was poorly implemented.
  content = content.replace(/ aria-label="Interactive Element"/g, '');
  
  // Also remove ` alt="Image"` because it might have broken `<img src={...} />` by turning it into `<img src={...} alt="Image"> />`
  // since `[^>]*` stops at `>` but for `<img ... />`, the `props` includes `/`, so it became `<img ... / alt="Image">` ? No, `props` was up to `>`. So `<img src="..." / alt="Image">`. That might be valid XML but let's be safe.
  content = content.replace(/ alt="Image"/g, '');
  content = content.replace(/ \/ alt="Image">/g, ' />');

  if (content !== originalContent) {
    fs.writeFileSync(f, content);
    console.log('Reverted V3 errors in ' + f);
    revertedFiles++;
  }
});

console.log(`Reverted ${revertedFiles} files for Vòng 3 errors.`);
