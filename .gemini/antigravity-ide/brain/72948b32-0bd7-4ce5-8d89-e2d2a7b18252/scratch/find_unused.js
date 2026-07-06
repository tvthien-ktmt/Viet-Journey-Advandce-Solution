const fs = require('fs');
const path = require('path');

const srcDir = path.resolve('D:/Viet Journey Advandce Solution/frontend/src');

function getAllFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const allFiles = getAllFiles(srcDir);
const unusedFiles = [];

for (const file of allFiles) {
  // skip entry points and tests
  if (file.endsWith('main.tsx') || file.endsWith('vite-env.d.ts') || file.includes('.test.') || file.endsWith('App.tsx') || file.endsWith('index.css')) {
    continue;
  }
  
  // To check if a file is used, we look for its basename (without extension) in all other files
  // Or we look for import statements pointing to it.
  // A simpler way: just grep the basename in all files.
  let isUsed = false;
  const basename = path.basename(file).replace(/\.tsx?$/, '');
  
  // also handle "index.ts" -> look for directory name
  let searchName = basename;
  if (searchName === 'index') {
    searchName = path.basename(path.dirname(file));
  }

  for (const otherFile of allFiles) {
    if (otherFile === file) continue;
    const content = fs.readFileSync(otherFile, 'utf8');
    // regex to match import ... from '.../searchName' or '<SearchName'
    // This is an approximation
    if (content.includes(searchName)) {
      isUsed = true;
      break;
    }
  }

  if (!isUsed) {
    unusedFiles.push(file);
  }
}

console.log(unusedFiles.join('\n'));
