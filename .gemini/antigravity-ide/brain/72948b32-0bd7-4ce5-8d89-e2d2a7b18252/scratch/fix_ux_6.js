const fs = require('fs');
const path = require('path');

// 6b. Focus ring css
const indexCss = path.resolve('D:/Viet Journey Advandce Solution/frontend/src/index.css');
if (fs.existsSync(indexCss)) {
  let content = fs.readFileSync(indexCss, 'utf8');
  if (!content.includes('focus-visible {')) {
    content += `\n\n/* Override Tailwind default blue focus ring về VNA brand */\ninput:focus,\nselect:focus,\ntextarea:focus,\nbutton:focus-visible {\n  outline: 2px solid #1f6fb2;\n  outline-offset: 2px;\n}\n`;
    fs.writeFileSync(indexCss, content);
    console.log('Fixed index.css');
  }
}

// 6c. & 6d. HeroSearch validation and Date min
const heroSearch = path.resolve('D:/Viet Journey Advandce Solution/frontend/src/components/home/HeroSearch.tsx');
if (fs.existsSync(heroSearch)) {
  let content = fs.readFileSync(heroSearch, 'utf8');
  
  if (!content.includes('const today = new Date()')) {
    content = content.replace('export function HeroSearch() {', "export function HeroSearch() {\n  const today = new Date().toISOString().split('T')[0];");
  }
  
  content = content.replace(/type="date"/g, 'type="date" min={today}');
  
  if (!content.includes("from === to")) {
    const handleSearchStart = "const handleSearch = () => {\n";
    const validationCode = "    if (!from || !to) { toast.error('Vui lòng chọn điểm đi và điểm đến'); return; }\n    if (from === to) { toast.error('Điểm đi và điểm đến không được trùng nhau'); return; }\n    if (!departDate) { toast.error('Vui lòng chọn ngày đi'); return; }\n    if (tripType === 'round' && !returnDate) { toast.error('Vui lòng chọn ngày về cho chuyến khứ hồi'); return; }\n    if (tripType === 'round' && returnDate < departDate) { toast.error('Ngày về phải sau ngày đi'); return; }\n";
    content = content.replace(handleSearchStart, handleSearchStart + validationCode);
    
    // need toast
    if (!content.includes("import toast")) {
      content = "import { toast } from 'sonner';\n" + content;
    }
  }

  fs.writeFileSync(heroSearch, content);
  console.log('Fixed HeroSearch');
}
