const fs = require('fs');
const readline = require('readline');
const path = require('path');

const transcriptPath = 'C:\\Users\\THIEN\\.gemini\\antigravity-ide\\brain\\72948b32-0bd7-4ce5-8d89-e2d2a7b18252\\.system_generated\\logs\\transcript_full.jsonl';

const fileStates = new Map();

async function run() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'PLANNER_RESPONSE' && obj.tool_calls) {
        for (const call of obj.tool_calls) {
          if (call.name && (call.name.includes('write_to_file') || call.name.includes('write_file') || call.name.includes('replace'))) {
            let args = call.args || call.arguments;
            if (typeof args === 'string') {
              try { args = JSON.parse(args); } catch(e) {}
            }
            if (args && args.TargetFile) {
              const normPath = args.TargetFile.replace(/\\/g, '/').toLowerCase();
              if (args.CodeContent) {
                fileStates.set(normPath, { path: args.TargetFile, content: args.CodeContent });
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  const outDir = 'd:\\Viet Journey Advandce Solution\\frontend\\src';
  
  const ignoreList = [
    'homepage.tsx',
    'rootlayout.tsx',
    'flightresults.tsx',
    'herosearch.tsx',
    'offerscarousel.tsx',
    'destinations.tsx',
    'specialoffers.tsx',
    'lotusmilessection.tsx',
    'travelclasses.tsx',
    'services.tsx',
    'newssection.tsx',
    'mocks/flights.ts'
  ];

  let count = 0;
  for (const [normPath, fileObj] of fileStates.entries()) {
    if (normPath.includes('/src/')) {
      const relPathMatch = fileObj.path.match(/src[\\\/](.*)/i);
      if (!relPathMatch) continue;
      const relPath = relPathMatch[1];
      
      const shouldIgnore = ignoreList.some(ig => relPath.toLowerCase().replace(/\\/g, '/').includes(ig));
      if (shouldIgnore) continue;

      const target = path.join(outDir, relPath);
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(target, fileObj.content, 'utf8');
      console.log('Restored:', target);
      count++;
    }
  }
  
  console.log(`Recovered ${count} files directly to frontend/src.`);
}

run();
