const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const outputFile = path.join(buildDir, 'rclone.txt');

function getFiles(dir, allFiles = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, allFiles);
    } else {
      // Pfad relativ zum Build-Ordner machen und Slashes vereinheitlichen
      const relativePath = path.relative(buildDir, name).replace(/\\/g, '/');
      // rclone.php selbst nicht mit auflisten
      if (relativePath !== 'rclone.txt') {
        allFiles.push(relativePath);
      }
    }
  });
  return allFiles;
}

const fileList = getFiles(buildDir).join('\n');
fs.writeFileSync(outputFile, fileList);
console.log(`✅ rclone.txt mit ${fileList.split('\n').length} Dateien generiert!`);