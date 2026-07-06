const fs = require('fs');
const path = require('path');

// 3a. AdminDashboardPage
const adminPage = path.resolve('D:/Viet Journey Advandce Solution/frontend/src/pages/AdminDashboardPage.tsx');
if (fs.existsSync(adminPage)) {
  let content = fs.readFileSync(adminPage, 'utf8');
  content = content.replace(/bg-blue-500/g, 'bg-vna-blue');
  content = content.replace(/text-blue-500/g, 'text-vna-blue');
  content = content.replace(/border-blue-500/g, 'border-vna-blue');
  
  // also check generic dashboard colors used in icons or badges
  fs.writeFileSync(adminPage, content);
  console.log('Fixed AdminDashboardPage colors');
}

// 3b. SiteHeader
const siteHeader = path.resolve('D:/Viet Journey Advandce Solution/frontend/src/components/layout/SiteHeader.tsx');
if (fs.existsSync(siteHeader)) {
  let content = fs.readFileSync(siteHeader, 'utf8');
  content = content.replace(/bg-\[#022f60\]/g, 'bg-vna-blue-800');
  content = content.replace(/text-\[#022f60\]/g, 'text-vna-blue-800');
  fs.writeFileSync(siteHeader, content);
  console.log('Fixed SiteHeader colors');
}

// 3c. Update tailwind.config.ts
const tailwindConfig = path.resolve('D:/Viet Journey Advandce Solution/frontend/tailwind.config.ts');
if (fs.existsSync(tailwindConfig)) {
  let content = fs.readFileSync(tailwindConfig, 'utf8');
  if (!content.includes("'022d5e'")) {
    content = content.replace(/DEFAULT: '#023a78',/g, "DEFAULT: '#023a78',\n          800: '#022d5e',\n          900: '#011f42',");
    fs.writeFileSync(tailwindConfig, content);
    console.log('Updated tailwind.config.ts');
  }
}
