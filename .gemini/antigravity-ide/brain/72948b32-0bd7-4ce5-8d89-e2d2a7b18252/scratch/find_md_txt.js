const fs = require('fs');
const path = require('path');

const rootDir = path.resolve('D:/Viet Journey Advandce Solution');
const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.gemini', 'dev-dist'];

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      if (!excludeDirs.includes(f)) {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.md') || f.endsWith('.txt')) {
        callback(dirPath);
      }
    }
  });
}

const toDelete = [];
walkDir(rootDir, (f) => {
  // We keep package.json, but this is about .md and .txt
  // Keep the root README.md? The user said "các file .md hay các file k dùng đến hay k cần nữa xóa hết đi nhé"
  // Let's list everything found.
  toDelete.push(f);
});

console.log(toDelete.join('\n'));
