const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../backend/src/controllers');
const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('console.error')) {
        content = content.replace(/console\.error/g, 'logger.error');
        
        if (!content.includes('import logger')) {
            // insert after last import
            const lines = content.split('\n');
            let lastImportIndex = 0;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('import ')) {
                    lastImportIndex = i;
                }
            }
            lines.splice(lastImportIndex + 1, 0, "import logger from '../utils/logger';");
            content = lines.join('\n');
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Replaced in ${file}`);
    }
});
