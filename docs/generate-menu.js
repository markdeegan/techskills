const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
// Folders or files you want the script to ignore completely
const IGNORED_NAMES = ['assets', 'css', 'js', 'node_modules', '.github', '.git'];

let htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic Study Vault</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; background: #f6f8fa; color: #24292f; }
        h1 { border-bottom: 2px solid #d0d7de; padding-bottom: 10px; color: #0969da; }
        .subject-block { background: white; border: 1px solid #d0d7de; border-radius: 6px; padding: 16px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .subject-title { font-size: 1.3rem; margin-top: 0; color: #1f2328; text-transform: capitalize; border-bottom: 1px dashed #d0d7de; padding-bottom: 6px; }
        ul { list-style: none; padding: 0; margin: 0; }
        li { padding: 6px 0; display: flex; align-items: center; }
        li::before { content: "📄"; margin-right: 8px; font-size: 0.9rem; }
        a { color: #0969da; text-decoration: none; font-weight: 500; text-transform: capitalize; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>📚 Course Materials Vault</h1>
    <div id="vault-container">
`;

// 1. Read and sort the items in the root folder alphabetically
const items = fs.readdirSync(rootDir).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

items.forEach(item => {
    const itemPath = path.join(rootDir, item);
    
    // Process only valid folders
    if (fs.statSync(itemPath).isDirectory() && !item.startsWith('.') && !IGNORED_NAMES.includes(item)) {
        const cleanFolderName = item.replace(/-/g, ' ');
        htmlContent += `        <div class="subject-block">\n            <h2 class="subject-title">📁 ${cleanFolderName}</h2>\n            <ul>\n`;
        
        // 2. Read contents inside the subject folder
        const files = fs.readdirSync(itemPath);
        
        // Filter for HTML topics and sort them alphabetically
        const htmlFiles = files
            .filter(file => file.endsWith('.html'))
            .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

        if (htmlFiles.length === 0) {
            htmlContent += `                <li style="color:#57606a; font-style:italic;">No topics found here.</li>\n`;
        } else {
            htmlFiles.forEach(file => {
                const topicName = file.replace('.html', '').replace(/-/g, ' ');
                const relativePath = `./${item}/${file}`;
                htmlContent += `                <li><a href="${relativePath}">${topicName}</a></li>\n`;
            });
        }
        
        htmlContent += `            </ul>\n        </div>\n`;
    }
});

htmlContent += `    </div>\n</body>\n</html>`;

// Save the statically generated code straight to index.html
fs.writeFileSync(path.join(rootDir, 'index.html'), htmlContent);
console.log('Successfully compiled index.html with alphabetical sorting!');
