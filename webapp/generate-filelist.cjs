const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const buildDir = path.join(__dirname, 'build');
const outputFile = path.join(buildDir, 'rclone.txt');

function getMd5(file) {
  const content = fs.readFileSync(file);
  return crypto.createHash('md5').update(content).digest('hex');
}

function getFiles(dir, allFiles = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, allFiles);
    } else {
      const relativePath = path.relative(buildDir, name).replace(/\\/g, '/');
      if (relativePath !== 'rclone.txt') {
        const hash = getMd5(name);
        allFiles.push(`${hash}  ${relativePath}`);
      }
    }
  });
  return allFiles;
}

const fileList = getFiles(buildDir).join('\n');
fs.writeFileSync(outputFile, fileList);
console.log(`✅ rclone.txt mit MD5-Hashes generiert!`);