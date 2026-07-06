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

walkDir(srcDir, (f) => {
  if (!f.endsWith('.tsx')) return;
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;

  // The regex needs to handle line breaks too
  // `<button className="flex items-center gap-2" [any chars except >] className="` -> `<button [any chars except >] className="flex items-center gap-2 `
  content = content.replace(/<([a-zA-Z]+) className="flex items-center gap-2"\s+([^>]*?)className="/g, '<$1 $2className="flex items-center gap-2 ');
  
  if (content !== originalContent) {
    fs.writeFileSync(f, content);
    console.log('Fixed duplicate className in ' + f);
  }
});
