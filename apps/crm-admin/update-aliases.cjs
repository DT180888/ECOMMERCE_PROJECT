const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Function to recursively get all files
function getAllFiles(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)
  
    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        if(file.endsWith('.ts') || file.endsWith('.tsx')) {
            arrayOfFiles.push(path.join(dirPath, "/", file))
        }
      }
    })
  
    return arrayOfFiles
}

const allFiles = getAllFiles(srcDir);

// Update import contents for aliases
for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf-8');
    let originalContent = content;

    // Pages
    content = content.replace(/@pages\/(account|auth|cart|catalog|checkout|product)/g, '@pages/client/$1');
    content = content.replace(/@pages\/HomePage/g, '@pages/client/HomePage');
    
    // Widgets (Client)
    content = content.replace(/@widgets\/(Header|Footer|Hero|Promo|Cart|CategoryGrid|Address|CatalogFilters|Newsletter|Product|SnapDots)/g, '@widgets/client/$1');
    
    // Widgets (Admin)
    content = content.replace(/@widgets\/(Sidebar|Uploader)/g, '@widgets/admin/$1');
    
    // Features (Client)
    content = content.replace(/@features\/(auth|cart|payment)/g, '@features/client/$1');

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated aliases in ${file}`);
    }
}
console.log("Alias update done");
