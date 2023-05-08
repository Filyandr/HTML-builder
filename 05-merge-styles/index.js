const path = require('path');
const fs = require('fs')
const fsPromises = require('fs/promises');

const stylesFolder = path.resolve(__dirname, 'styles');
const bundleFolder = path.resolve(__dirname, 'project-dist');
const bundleFile = path.join(bundleFolder, 'bundle.css');

const bundletFile = fs.createWriteStream(bundleFile);

async function mergeStyles() {
  try {
    const files = await fsPromises.readdir(stylesFolder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const stylePath = path.resolve(__dirname, 'styles', file.name);
        fs.createReadStream(stylePath).pipe(bundletFile);
      }}
  } catch (error) {
    console.log(`Error bundling CSS: ${error}`);
  }
}
mergeStyles();