import fs from 'fs';
import { dict } from './src/store/langStore.js';

fs.mkdirSync('./src/locales', { recursive: true });
fs.writeFileSync('./src/locales/vi.json', JSON.stringify(dict.vn, null, 2));
fs.writeFileSync('./src/locales/en.json', JSON.stringify(dict.en, null, 2));
console.log('Done');
