const fs = require('fs');
let c = fs.readFileSync('src/store/langStore.ts', 'utf8');
c = c.replace(/export const dict = \{[\s\S]*?\} as const;/, `import vnDict from '../locales/vi.json';\nimport enDict from '../locales/en.json';\n\nexport const dict = {\n  vn: vnDict,\n  en: enDict,\n} as const;`);
fs.writeFileSync('src/store/langStore.ts', c);
