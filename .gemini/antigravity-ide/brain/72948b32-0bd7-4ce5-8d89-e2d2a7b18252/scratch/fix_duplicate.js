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

  // We are looking for something like `<Button className="flex items-center gap-2" [other props] className="something"`
  
  const tags = ['button', 'Button', 'a', 'Link'];
  tags.forEach(tag => {
    // match the open tag across multiple lines
    const regex = new RegExp(`(<${tag}[\\s\\S]*?>)`, 'g');
    content = content.replace(regex, (match) => {
      if (!match.includes('className="flex items-center gap-2"')) return match;
      
      const parts = match.split('className=');
      if (parts.length > 2) {
        // Remove the one we added
        let newMatch = match.replace(/\\s*className="flex items-center gap-2"/, '');
        // Sometimes it's exactly `<button className="flex items-center gap-2"` -> `<button`
        newMatch = newMatch.replace(/className="flex items-center gap-2"/, '');
        
        // Inject flex into the *other* className
        if (newMatch.includes('className="')) {
          newMatch = newMatch.replace('className="', 'className="flex items-center gap-2 ');
        } else if (newMatch.includes("className={'")) {
          newMatch = newMatch.replace("className={'", "className={'flex items-center gap-2 ");
        } else if (newMatch.includes('className={`')) {
          newMatch = newMatch.replace('className={`', 'className={`flex items-center gap-2 ');
        } else if (newMatch.includes('className={cn(')) {
          newMatch = newMatch.replace('className={cn(', 'className={cn("flex items-center gap-2", ');
        }
        return newMatch;
      }
      return match;
    });
  });

  if (content !== originalContent) {
    fs.writeFileSync(f, content);
    console.log('Fixed duplicate className in ' + f);
  }
});
