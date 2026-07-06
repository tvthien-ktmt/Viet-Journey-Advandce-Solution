import os, glob

html_files = [f for f in glob.glob('*.html')]
html_files.sort()

links = ""
for file in html_files:
    if file != 'sitemap.html':
        links += f'<li><a href="{file}" class="text-body text-primary hover-underline" style="display:block; padding:8px 0; border-bottom:1px solid var(--color-outline-variant);">{file}</a></li>\n'

sitemap_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VietJourney - Sitemap</title>
    <link rel="stylesheet" href="assets/css/base/reset.css">
    <link rel="stylesheet" href="assets/css/base/variables.css">
    <link rel="stylesheet" href="assets/css/base/typography.css">
    <link rel="stylesheet" href="assets/css/utilities.css">
    <link rel="stylesheet" href="assets/css/layout/header.css">
    <link rel="stylesheet" href="assets/css/layout/footer.css">
</head>
<body class="bg-background text-on-background font-body antialiased u-flex u-flex-col min-h-screen">
    <header class="header">
        <div class="header__container u-container">
            <a href="index.html" class="header__brand">VietJourney</a>
        </div>
    </header>

    <main class="u-flex-grow u-container" style="padding-top: var(--spacing-xl); padding-bottom: var(--spacing-xl); max-width: 800px;">
        <h1 class="text-display u-mb-lg">Sitemap (Danh sách các trang)</h1>
        <ul style="list-style: none; padding: 0;">
            {links}
        </ul>
    </main>
</body>
</html>"""

with open('sitemap.html', 'w', encoding='utf-8') as f:
    f.write(sitemap_content)

print('sitemap.html generated successfully!')
