const fs = require('fs');
const path = require('path');

const adminPath = path.resolve('D:/Viet Journey Advandce Solution/frontend/src/pages/AdminDashboardPage.tsx');
if (fs.existsSync(adminPath)) {
  let content = fs.readFileSync(adminPath, 'utf8');
  
  if (!content.includes('const [isLoading, setIsLoading]')) {
    // Add state
    content = content.replace('export default function AdminDashboardPage() {', 'export default function AdminDashboardPage() {\n  const [isLoading, setIsLoading] = React.useState(true);\n  React.useEffect(() => { const t = setTimeout(() => setIsLoading(false), 1000); return () => clearTimeout(t); }, []);');
  }

  // Replace <ResponsiveContainer ...> ... </ResponsiveContainer>
  content = content.replace(/(<ResponsiveContainer[^>]*>[\s\S]*?<\/ResponsiveContainer>)/g, (match) => {
    return `{isLoading ? (\n                <div className="animate-pulse bg-gray-200 rounded-xl h-64 w-full" aria-label="Đang tải biểu đồ..." />\n              ) : (\n                ${match}\n              )}`;
  });

  fs.writeFileSync(adminPath, content);
  console.log('Fixed AdminDashboardPage empty state');
}
