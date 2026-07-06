const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const dataPath = path.join(rootDir, 'assets/data/blogs.json');
const helpersPath = path.join(rootDir, 'assets/js/modules/render-helpers.js');
const articlesDir = path.join(rootDir, 'articles');
const cssPath = path.join(rootDir, 'assets/css/pages/article.css');

// 1. Ensure directories exist
if (!fs.existsSync(articlesDir)) fs.mkdirSync(articlesDir);
const cssDir = path.dirname(cssPath);
if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });

// 2. Read blogs.json
let blogs = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

function createSlug(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// 3. Add slug to blogs
blogs = blogs.map(b => ({
    ...b,
    slug: b.slug || createSlug(b.title)
}));
fs.writeFileSync(dataPath, JSON.stringify(blogs, null, 2));

// 4. Update render-helpers.js
let helpersContent = fs.readFileSync(helpersPath, 'utf-8');
helpersContent = helpersContent.replace(/href="blog\.html\?id=\$\{blog\.id\}"/g, 'href="articles/${blog.slug}.html"');
helpersContent = helpersContent.replace(/href="blog\.html\?id=\$\{large\.id\}"/g, 'href="articles/${large.slug}.html"');
helpersContent = helpersContent.replace(/href="blog\.html\?id=\$\{small\.id\}"/g, 'href="articles/${small.slug}.html"');
fs.writeFileSync(helpersPath, helpersContent);

// 5. Create article.css
const cssContent = `
/* article.css - BEM Methodology */
.article-page {
    background-color: var(--color-surface);
    padding-bottom: var(--spacing-4xl);
}

.article-hero {
    position: relative;
    width: 100%;
    height: 400px;
    margin-bottom: var(--spacing-2xl);
    overflow: hidden;
}

.article-hero__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.article-hero__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7));
}

.article-hero__content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: var(--spacing-2xl) 0;
    color: var(--color-on-primary);
}

.article-hero__badge {
    display: inline-block;
    background-color: var(--color-primary);
    color: var(--color-on-primary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-md);
    font-weight: 600;
}

.article-hero__title {
    color: var(--color-on-primary);
    margin-bottom: var(--spacing-md);
}

.article-hero__meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    color: rgba(255, 255, 255, 0.8);
}

.article-breadcrumb {
    margin: var(--spacing-lg) 0;
    color: var(--color-on-surface-variant);
}

.article-breadcrumb a {
    color: var(--color-primary);
    text-decoration: none;
}

.article-breadcrumb a:hover {
    text-decoration: underline;
}

.article__content {
    max-width: 800px;
    margin: 0 auto;
}

.article__content > * {
    margin-bottom: var(--spacing-md);
    line-height: 1.8;
}

.article__content h2 {
    margin-top: var(--spacing-xl);
    margin-bottom: var(--spacing-md);
    color: var(--color-primary-dark);
}

.article__content img {
    width: 100%;
    border-radius: var(--radius-lg);
    margin: var(--spacing-lg) 0;
}

.article__content ul, .article__content ol {
    padding-left: var(--spacing-xl);
    margin-bottom: var(--spacing-md);
}

.article__content li {
    margin-bottom: var(--spacing-sm);
}

.related-articles {
    max-width: 800px;
    margin: var(--spacing-4xl) auto 0;
    border-top: 1px solid var(--color-outline-variant);
    padding-top: var(--spacing-2xl);
}

.related-articles__title {
    margin-bottom: var(--spacing-lg);
}

.related-articles__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--spacing-lg);
}

@media (max-width: 768px) {
    .article-hero {
        height: 300px;
    }
    .article-hero__title {
        font-size: 2rem;
    }
}
`;
fs.writeFileSync(cssPath, cssContent);

// 6. Generate HTML pages
const getContent = (id) => {
    switch(id) {
        case 'b1': return `
            <p class="text-body-lg" style="font-weight:500">Sapa mùa thu khoác lên mình chiếc áo vàng rực rỡ của những thửa ruộng bậc thang mùa lúa chín. Cùng khám phá bí kíp du lịch Sapa hoàn hảo nhất.</p>
            <h2 class="text-h2">1. Thời điểm lý tưởng nhất để săn lúa chín</h2>
            <p class="text-body">Mùa lúa chín ở Sapa thường bắt đầu từ cuối tháng 8 đến đầu tháng 10. Khoảng thời gian từ giữa đến cuối tháng 9 được xem là lúc lúa vàng rực rỡ nhất.</p>
            <h2 class="text-h2">2. Điểm ngắm lúa tuyệt đỉnh</h2>
            <ul class="text-body">
                <li><strong>Thung lũng Mường Hoa:</strong> Nơi có ruộng bậc thang lớn nhất và đẹp nhất Sapa.</li>
                <li><strong>Bản Cát Cát:</strong> Vừa ngắm lúa vừa trải nghiệm văn hóa bản địa.</li>
                <li><strong>Đèo Ô Quy Hồ:</strong> Khung cảnh hoàng hôn xuống trên những cánh đồng vàng vô giá.</li>
            </ul>
            <figure>
                <img src="https://loremflickr.com/800/400/sapa,terraces" alt="Ruộng bậc thang Sapa" loading="lazy">
                <figcaption class="text-label text-on-surface-variant u-text-center">Vẻ đẹp hùng vĩ của ruộng bậc thang Sapa</figcaption>
            </figure>
            <h2 class="text-h2">3. Ăn gì khi đến Sapa mùa này?</h2>
            <p class="text-body">Đừng quên thưởng thức lẩu cá tầm, đồ nướng Sapa trong tiết trời se lạnh. Thắng cố và xôi bảy màu cũng là những đặc sản không thể bỏ lỡ.</p>
            <p class="text-body">Hãy chuẩn bị máy ảnh và xách ba lô lên để không lỡ hẹn với mùa vàng Sapa năm nay nhé!</p>
        `;
        case 'b2': return `
            <p class="text-body-lg" style="font-weight:500">Bỏ qua sự ồn ào của phố thị, hãy tìm về 10 bãi biển vắng lặng tuyệt đẹp trải dài từ Phú Yên đến Ninh Thuận.</p>
            <h2 class="text-h2">Top các bãi biển chưa bị "du lịch hóa"</h2>
            <ol class="text-body">
                <li><strong>Bãi Môn, Phú Yên:</strong> Bãi biển nhỏ xinh nằm dưới chân mũi Điện, tĩnh lặng và hoang sơ.</li>
                <li><strong>Biển Bình Tiên, Ninh Thuận:</strong> Được ví như viên ngọc ẩn mình với dải cát trắng mịn.</li>
                <li><strong>Bãi Rạng, Bình Thuận:</strong> Giao thoa giữa nét đẹp hoang sơ và các khu nghỉ dưỡng sang trọng.</li>
            </ol>
            <figure>
                <img src="https://loremflickr.com/800/400/vietnam,beach" alt="Bãi biển hoang sơ" loading="lazy">
                <figcaption class="text-label text-on-surface-variant u-text-center">Nét hoang sơ chưa bị khai phá</figcaption>
            </figure>
            <h2 class="text-h2">Kinh nghiệm cắm trại qua đêm</h2>
            <p class="text-body">Khi đến các bãi biển hoang sơ, trải nghiệm cắm trại là tuyệt vời nhất. Tuy nhiên, hãy nhớ mang theo nước ngọt, đồ dự trữ và dọn sạch rác trước khi rời đi để bảo vệ môi trường.</p>
        `;
        case 'b3': return `
            <p class="text-body-lg" style="font-weight:500">Trải nghiệm 2 ngày 1 đêm tại resort 6 sao đắt đỏ nhất Việt Nam để xem dịch vụ ở đây có thực sự xuất sắc như lời đồn.</p>
            <h2 class="text-h2">Kiến trúc và không gian</h2>
            <p class="text-body">Nằm chênh vênh trên vách đá nhìn ra Vịnh Vĩnh Hy, Amanoi mang kiến trúc Đông Dương đương đại hòa quyện với thiên nhiên hùng vĩ.</p>
            <figure>
                <img src="https://loremflickr.com/800/400/luxury,resort" alt="Amanoi Resort" loading="lazy">
                <figcaption class="text-label text-on-surface-variant u-text-center">Không gian nghỉ dưỡng tuyệt hảo</figcaption>
            </figure>
            <h2 class="text-h2">Dịch vụ 6 sao đẳng cấp</h2>
            <p class="text-body">Mỗi villa đều có quản gia riêng. Điểm nhấn là dịch vụ Spa bên hồ sen tĩnh lặng và các lớp yoga chào mặt trời tuyệt đỉnh.</p>
            <h2 class="text-h2">Có đáng giá tiền?</h2>
            <p class="text-body">Với mức giá từ 20 triệu/đêm, bạn không chỉ trả cho phòng nghỉ mà đang trả tiền cho sự riêng tư tuyệt đối và trải nghiệm "chữa lành" không thể đong đếm.</p>
        `;
        case 'b4': return `
            <p class="text-body-lg" style="font-weight:500">Gợi ý lịch trình Food Tour quanh khu phố cổ Hà Nội cực rẻ mà cực chất dành cho tín đồ sành ăn.</p>
            <h2 class="text-h2">Buổi sáng: Nạp năng lượng</h2>
            <p class="text-body">- Phở Bát Đàn (50k): Thức dậy sớm và xếp hàng để thưởng thức tô phở bò gia truyền chuẩn vị.</p>
            <p class="text-body">- Cà phê Giảng (30k): Thưởng thức cà phê trứng trứ danh Hà Thành.</p>
            <figure>
                <img src="https://loremflickr.com/800/400/hanoi,food" alt="Ẩm thực Hà Nội" loading="lazy">
                <figcaption class="text-label text-on-surface-variant u-text-center">Tinh hoa ẩm thực thủ đô</figcaption>
            </figure>
            <h2 class="text-h2">Buổi trưa & Chiều</h2>
            <p class="text-body">- Bún chả Hàng Quạt (45k)<br>- Nộm bò khô hồ Hoàn Kiếm (40k)<br>- Bánh gối, bánh rán mặn Lý Quốc Sư (50k)</p>
            <h2 class="text-h2">Tổng kết</h2>
            <p class="text-body">Chỉ với khoảng 500k, bạn đã có thể khám phá gần như trọn vẹn tinh hoa ẩm thực đường phố Hà Nội. Hãy rủ thêm bạn bè để thử được nhiều món hơn nhé!</p>
        `;
        case 'b5': return `
            <p class="text-body-lg" style="font-weight:500">Làm thế nào để chinh phục sống lưng khủng long Tà Xùa và đón bình minh trên biển mây một cách an toàn và trọn vẹn nhất.</p>
            <h2 class="text-h2">Tà Xùa ở đâu?</h2>
            <p class="text-body">Tà Xùa là một xã vùng cao thuộc huyện Bắc Yên, tỉnh Sơn La, nổi tiếng với biển mây bồng bềnh như tiên cảnh.</p>
            <figure>
                <img src="https://loremflickr.com/800/400/mountain,clouds" alt="Săn mây Tà Xùa" loading="lazy">
                <figcaption class="text-label text-on-surface-variant u-text-center">Biển mây Tà Xùa lúc bình minh</figcaption>
            </figure>
            <h2 class="text-h2">Kinh nghiệm săn mây thành công</h2>
            <ul class="text-body">
                <li><strong>Kiểm tra thời tiết:</strong> Mây thường xuất hiện sau những ngày mưa phùn và lạnh.</li>
                <li><strong>Phương tiện:</strong> Đường dốc và trơn, ưu tiên đi xe số và phải vững tay lái.</li>
                <li><strong>Chuẩn bị:</strong> Áo ấm, giày leo núi chống trượt và thuốc men cơ bản.</li>
            </ul>
        `;
        case 'b6': return `
            <p class="text-body-lg" style="font-weight:500">Du lịch xanh, du lịch bền vững không chỉ là xu hướng nhất thời mà đã trở thành phong cách sống mới của giới trẻ.</p>
            <h2 class="text-h2">Du lịch xanh là gì?</h2>
            <p class="text-body">Là loại hình du lịch giảm thiểu tác động tiêu cực đến môi trường, bảo vệ thiên nhiên và tôn trọng văn hóa bản địa.</p>
            <figure>
                <img src="https://loremflickr.com/800/400/ecotourism,nature" alt="Du lịch xanh" loading="lazy">
                <figcaption class="text-label text-on-surface-variant u-text-center">Bảo vệ môi trường khi đi du lịch</figcaption>
            </figure>
            <h2 class="text-h2">Cách để trở thành "Green Traveler"</h2>
            <ul class="text-body">
                <li>Hạn chế sử dụng đồ nhựa dùng một lần.</li>
                <li>Ủng hộ các homestay sinh thái và sản phẩm địa phương.</li>
                <li>Không để lại gì ngoài những dấu chân.</li>
            </ul>
        `;
        case 'b7': return `
            <p class="text-body-lg" style="font-weight:500">Lắng nghe những câu chuyện dung dị về phố cổ qua lời kể của những con người đã gắn bó cả đời với nơi này.</p>
            <h2 class="text-h2">Hồn cốt phố Hội</h2>
            <p class="text-body">Hội An không chỉ có đèn lồng và tường vàng. Hội An còn là tiếng rao của gánh xí mà phù, là mùi trầm hương thoang thoảng từ các ngôi nhà cổ.</p>
            <figure>
                <img src="https://loremflickr.com/800/400/hoian,lanterns" alt="Hội An mùa đèn lồng" loading="lazy">
                <figcaption class="text-label text-on-surface-variant u-text-center">Đêm lồng đèn phố Hội</figcaption>
            </figure>
            <h2 class="text-h2">Góc nhìn bản địa</h2>
            <p class="text-body">"Đừng chỉ đi dọc phố Trần Phú, hãy len lỏi vào các con hẻm nhỏ để thấy một Hội An bình yên đến lạ" - Chú Tư, người làm lồng đèn 40 năm chia sẻ.</p>
        `;
        case 'b8': return `
            <p class="text-body-lg" style="font-weight:500">Toàn bộ kinh nghiệm chuẩn bị hành lý, bảo dưỡng xe và lộ trình phượt dọc chiều dài đất nước chi tiết nhất.</p>
            <h2 class="text-h2">Khâu chuẩn bị sống còn</h2>
            <ul class="text-body">
                <li><strong>Bảo dưỡng xe:</strong> Thay nhớt, kiểm tra lốp, nhông xích và hệ thống phanh trước khi đi.</li>
                <li><strong>Hành lý:</strong> Gọn nhẹ nhất có thể, mang theo đồ vá xe cơ bản và bộ y tế dự phòng.</li>
            </ul>
            <figure>
                <img src="https://loremflickr.com/800/400/motorbike,vietnam" alt="Phượt xuyên Việt" loading="lazy">
                <figcaption class="text-label text-on-surface-variant u-text-center">Hành trình khám phá dọc đất nước</figcaption>
            </figure>
            <h2 class="text-h2">Lộ trình 30 ngày (Tham khảo)</h2>
            <p class="text-body">Đi dọc theo đường mòn Hồ Chí Minh để ngắm núi rừng, sau đó vòng ra QL1A để ôm trọn đường bờ biển tuyệt đẹp của Tổ quốc.</p>
        `;
        default: return '<p>Nội dung đang được cập nhật...</p>';
    }
};

const getRelatedBlogsHTML = (currentId) => {
    const related = blogs.filter(b => b.id !== currentId).sort(() => 0.5 - Math.random()).slice(0, 3);
    return related.map(b => `
        <div class="blog-card" style="box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-radius: var(--radius-lg); overflow: hidden; background: var(--color-surface); display: flex; flex-direction: column;">
            <a href="${b.slug}.html" style="text-decoration:none; color:inherit; flex-grow: 1;">
                <img src="../${b.thumbnail}" alt="${b.title}" style="width: 100%; height: 180px; object-fit: cover;">
                <div style="padding: var(--spacing-md);">
                    <h5 class="text-h5 u-line-clamp-2" style="margin-bottom: var(--spacing-xs);">${b.title}</h5>
                    <div class="text-label text-on-surface-variant">${b.date} • ${b.readTime}</div>
                </div>
            </a>
        </div>
    `).join('');
};

const layoutTemplate = (blog) => `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${blog.title} - VietJourney Blog</title>
    <meta name="description" content="${blog.excerpt}">
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Material Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
    
    <!-- CSS -->
    <link rel="stylesheet" href="../assets/css/base/reset.css">
    <link rel="stylesheet" href="../assets/css/base/variables.css">
    <link rel="stylesheet" href="../assets/css/base/typography.css">
    <link rel="stylesheet" href="../assets/css/utilities.css">
    <link rel="stylesheet" href="../assets/css/layout/header.css">
    <link rel="stylesheet" href="../assets/css/layout/footer.css">
    <link rel="stylesheet" href="../assets/css/pages/article.css">
</head>
<body class="article-page">

    <!-- Header -->
    <header class="header">
        <div class="header__container u-container">
            <a href="../index.html" class="header__brand">VietJourney</a>
            <nav class="header__nav">
                <a href="../index.html" class="header__nav-link text-body">Trang chủ</a>
                <a href="../destinations.html" class="header__nav-link text-body">Địa điểm</a>
                <a href="../tours-hotels.html" class="header__nav-link text-body">Tour</a>
                <a href="../tours-hotels.html" class="header__nav-link text-body">Khách sạn</a>
                <a href="../flights.html" class="header__nav-link text-body">Vé máy bay</a>
                <a href="../blog.html" class="header__nav-link header__nav-link--active text-body">Blog</a>
            </nav>
            <div class="header__actions">
                <div class="header__auth-group">
                    <a href="../login.html" class="button button--outline text-label">Đăng nhập</a>
                </div>
            </div>
        </div>
    </header>

    <main class="article-main">
        <div class="article-hero">
            <img src="../${blog.thumbnail}" alt="${blog.title}" class="article-hero__img">
            <div class="article-hero__overlay"></div>
            <div class="u-container" style="position: relative; height: 100%;">
                <div class="article-hero__content">
                    <span class="article-hero__badge">${blog.category}</span>
                    <h1 class="article-hero__title text-display">${blog.title}</h1>
                    <div class="article-hero__meta text-body">
                        <span class="material-symbols-outlined" style="font-size: 20px;">account_circle</span> ${blog.author}
                        <span class="material-symbols-outlined" style="font-size: 20px; margin-left: 16px;">calendar_month</span> ${blog.date}
                        <span class="material-symbols-outlined" style="font-size: 20px; margin-left: 16px;">schedule</span> ${blog.readTime}
                    </div>
                </div>
            </div>
        </div>

        <div class="u-container">
            <nav class="article-breadcrumb text-body-sm">
                <a href="../index.html">Trang chủ</a> / 
                <a href="../blog.html">Cẩm nang du lịch</a> / 
                <span style="color: var(--color-on-surface); font-weight: 500;">${blog.title}</span>
            </nav>

            <article class="article__content">
                ${getContent(blog.id)}
            </article>

            <section class="related-articles">
                <h3 class="related-articles__title text-h3">Bài viết liên quan</h3>
                <div class="related-articles__grid">
                    ${getRelatedBlogsHTML(blog.id)}
                </div>
            </section>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer" style="margin-top: var(--spacing-4xl);">
        <div class="footer__container u-container">
            <div class="footer__brand-col">
                <a href="../index.html" class="footer__brand-name">VietJourney</a>
                <p class="footer__brand-desc text-body-sm">Mang đến những trải nghiệm du lịch tuyệt vời nhất tại Việt Nam.</p>
            </div>
        </div>
        <div class="footer__bottom">
            <div class="u-container">© 2024 VietJourney. All rights reserved.</div>
        </div>
    </footer>

</body>
</html>`;

blogs.forEach(blog => {
    fs.writeFileSync(path.join(articlesDir, `${blog.slug}.html`), layoutTemplate(blog));
});

console.log(`Generated ${blogs.length} articles.`);
