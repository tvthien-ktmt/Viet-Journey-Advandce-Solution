import os, glob

for file in glob.glob('D:/Viet Journey Advandce Solution/*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'src="assets/js/main.js"' not in content:
        # insert right before </body>
        script_tag = '<script src="assets/js/main.js" type="module"></script>\n'
        content = content.replace('</body>', script_tag + '</body>')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Added main.js to {file}')
