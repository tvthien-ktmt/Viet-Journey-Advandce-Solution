import { Project, SyntaxKind } from 'ts-morph';

const project = new Project({ tsConfigFilePath: './tsconfig.app.json' });

let filesChangedCount = 0;

for (const sourceFile of project.getSourceFiles()) {
  let fileChanged = false;

  // 1. Fix catch(e) -> catch(_e) or catch(err) -> catch(_err)
  const catchClauses = sourceFile.getDescendantsOfKind(SyntaxKind.CatchClause);
  for (const catchClause of catchClauses) {
    const variable = catchClause.getVariableDeclaration();
    if (variable) {
      const name = variable.getName();
      if (!name.startsWith('_')) {
        variable.rename('_' + name);
        fileChanged = true;
      }
    }
  }

  if (fileChanged) {
    sourceFile.saveSync();
    filesChangedCount++;
  }
}

console.log(`Updated catch variables in ${filesChangedCount} files.`);
