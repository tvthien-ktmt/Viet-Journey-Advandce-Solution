const fs = require('fs');
const path = require('path');

const fixInput = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('transition-all duration-300')) {
    let newContent = content.replace(/transition-all duration-300/g, 'transition-colors duration-200');
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Fixed Input in ${filePath}`);
    }
  }
};

['src/components/ui/input.tsx', 'src/pages/LoginPage.tsx', 'src/pages/RegisterPage.tsx', 'src/components/home/HeroSearch.tsx'].forEach(f => {
  fixInput(path.resolve('D:/Viet Journey Advandce Solution/frontend', f));
});

// For OffersCarousel
const carouselPath = path.resolve('D:/Viet Journey Advandce Solution/frontend/src/components/home/OffersCarousel.tsx');
if (fs.existsSync(carouselPath)) {
  let content = fs.readFileSync(carouselPath, 'utf8');
  // the container: className="overflow-hidden ... transition-all"
  // remove transition-all duration-300
  let newContent = content.replace(/transition-all duration-300/g, '');
  if (newContent !== content) {
    fs.writeFileSync(carouselPath, newContent);
    console.log(`Fixed Carousel in ${carouselPath}`);
  }
}
