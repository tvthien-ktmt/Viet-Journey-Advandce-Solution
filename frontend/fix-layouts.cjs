const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');

// Pages that should use SidebarLayout
const sidebarPages = ['SettingsPage.tsx', 'NotificationsPage.tsx'];

for (const file of sidebarPages) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/import MainLayout from '..\/components\/layout\/MainLayout';\r?\n/, 'import SidebarLayout from \'../components/layout/SidebarLayout\';\n');
  content = content.replace(/<MainLayout>/, '<SidebarLayout>');
  content = content.replace(/<\/MainLayout>/, '</SidebarLayout>');
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}

// Pages that should just remove MainLayout wrapper (since App.tsx provides it)
const noLayoutPages = [
  'BlogDetailPage.tsx',
  'BlogPage.tsx',
  'ComparePage.tsx',
  'ContactPage.tsx',
  'FaqPage.tsx',
  'SearchResultsPage.tsx'
];

for (const file of noLayoutPages) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  content = content.replace(/import MainLayout from '..\/components\/layout\/MainLayout';\r?\n/, '');
  content = content.replace(/<MainLayout>/, '<>');
  content = content.replace(/<\/MainLayout>/, '</>');
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Updated ${file}`);
}
