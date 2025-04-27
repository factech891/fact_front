const fs = require('fs');
const path = require('path');

function addReactImport(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      addReactImport(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if already has React import
        if (!content.includes('import React')) {
          content = `import React from 'react';\n${content}`;
          fs.writeFileSync(filePath, content);
          console.log(`Añadido import React a: ${filePath}`);
        }
      } catch (err) {
        console.error(`Error procesando ${filePath}: ${err.message}`);
      }
    }
  });
}

// Inicia el proceso en la carpeta src
addReactImport('./src');