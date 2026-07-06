const fs = require('fs');
const path = require('path');

const rootDir = 'D:/Viet Journey Advandce Solution';

const filesToDelete = [
  'README.md',
  'frontend/README.md',
  'backend/README.md',
  'backend/HELP.md',
  'frontend/public/robots.txt',
  'robots.txt',
  'frontend/src/components/common/BackToTop.tsx',
  'frontend/src/components/common/Breadcrumbs.tsx',
  'frontend/src/components/common/Chatbot.tsx',
  'frontend/src/components/common/CookieConsent.tsx',
  'frontend/src/components/common/ErrorBoundary.tsx',
  'frontend/src/components/common/GlobalSearch.tsx',
  'frontend/src/components/common/NewsletterPopup.tsx',
  'frontend/src/components/common/OfflineBanner.tsx',
  'frontend/src/components/common/PageTransition.tsx',
  'frontend/src/components/common/SessionExpiredModal.tsx',
  'frontend/src/components/dashboard/ChartSkeleton.tsx',
  'frontend/src/components/dashboard/RevenueChart.tsx',
  'frontend/src/components/dashboard/ServicePieChart.tsx',
  'frontend/src/components/dashboard/TopToursChart.tsx',
  'frontend/src/components/dashboard/UserAreaChart.tsx',
  'frontend/src/components/ui/alert-dialog.tsx',
  'frontend/src/components/ui/command.tsx',
  'frontend/src/components/ui/dropdown-menu.tsx',
  'frontend/src/components/ui/hover-card.tsx',
  'frontend/src/components/ui/pagination.tsx',
  'frontend/src/components/ui/scroll-area.tsx',
  'frontend/src/components/ui/tooltip.tsx',
  'frontend/src/pages/ExperiencePage.tsx',
  'frontend/src/pages/profile/ProfileInfoPage.tsx',
  'frontend/src/pages/profile/WishlistPage.tsx',
  'frontend/src/hooks/queries/useCreateBooking.ts',
  'frontend/src/hooks/queries/useTourDetail.ts',
  'frontend/src/hooks/queries/useTours.ts',
  'frontend/src/hooks/useIntersectionObserver.ts',
  'frontend/src/hooks/useLocalStorage.ts',
  'frontend/src/hooks/usePagination.ts',
  'frontend/src/hooks/useScrollY.ts',
  'frontend/src/hooks/useSeo.ts',
  'frontend/src/providers/QueryProvider.tsx',
  'frontend/src/setupTests.ts',
  'frontend/src/store/bookingFormStore.ts',
  'frontend/src/store/currencyStore.ts',
  'frontend/src/store/themeStore.ts',
  'frontend/src/styles/design-tokens.ts'
];

let deletedCount = 0;
let failedCount = 0;

for (const relPath of filesToDelete) {
  const fullPath = path.join(rootDir, relPath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`Deleted: ${relPath}`);
      deletedCount++;
    } catch (e) {
      console.error(`Failed to delete: ${relPath} - ${e.message}`);
      failedCount++;
    }
  } else {
    console.log(`File not found, skipping: ${relPath}`);
  }
}

// Delete all txt files in backend/target/surefire-reports
const surefireDir = path.join(rootDir, 'backend/target/surefire-reports');
if (fs.existsSync(surefireDir)) {
  const files = fs.readdirSync(surefireDir);
  for (const file of files) {
    if (file.endsWith('.txt')) {
      const p = path.join(surefireDir, file);
      try {
        fs.unlinkSync(p);
        console.log(`Deleted: backend/target/surefire-reports/${file}`);
        deletedCount++;
      } catch (e) {
        console.error(`Failed to delete: ${file} - ${e.message}`);
        failedCount++;
      }
    }
  }
}

console.log(`\nSummary: ${deletedCount} files deleted, ${failedCount} failures.`);
