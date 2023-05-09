const path = require('path');
const fs = require('fs')
const fsPromises = require('fs/promises');

const pathToDist = path.resolve(__dirname, 'project-dist');
const pathToDistAssets = path.resolve(pathToDist, 'assets');
const pathToAssets = path.resolve(__dirname, 'assets');
const pathToComponents = path.resolve(__dirname, 'components');
const pathToTemplate = path.resolve(__dirname, 'template.html');
const pathToStyles = path.resolve(__dirname, 'styles');
const bundleFile = path.resolve(pathToDist, 'style.css');

// css
async function mergeStyles() {
  const bundletFile = fs.createWriteStream(bundleFile);
  try {
    const files = await fsPromises.readdir(pathToStyles, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const stylePath = path.resolve(__dirname, 'styles', file.name);
        fs.createReadStream(stylePath).pipe(bundletFile);
      }
    }
  } catch (error) {
    console.log(`Error bundling CSS: ${error}`);
  }
}

// Assets
async function copyAssetsFolder() {
  await fsPromises.rm(pathToDist, { recursive: true, force: true });
  await fsPromises.mkdir(pathToDistAssets, { recursive: true });
  copyAssets(pathToAssets, pathToDistAssets);
}

async function copyAssets (src, dist) {
const files = await fsPromises.readdir(src, { withFileTypes: true });
for (const file of files) {
  const filePath = path.resolve(src, file.name);
  const fileCopyPath = path.resolve(dist, file.name);
  if (file.isFile()) {
    fsPromises.copyFile(filePath, fileCopyPath);
  } else if (file.isDirectory()) {
    await fsPromises.mkdir(fileCopyPath, { recursive: true });
    await copyAssets(filePath, fileCopyPath);
  }
}
}

// HTML
// TO DO обернуть в async function fix
const templateReadStream = fs.createReadStream((pathToTemplate), 'utf-8');
let template = '';

templateReadStream.on('data', chunk => template += chunk);
templateReadStream.on('end', () => {
  let components = template.matchAll(/{{(\w+)}}/g);

  for (const component of components) {
    let componentName = path.normalize(path.join(component[0].slice(2, -2) + '.html'));

    fsPromises.readdir(path.normalize(pathToComponents), { withFileTypes: true }).then(files => {
      files.forEach(file => {
        let fileName = file.name;
        if (file.isFile() && fileName === componentName) {
          let filePath = path.normalize(path.join(path.normalize(pathToComponents), fileName));
          let fileContent = '';

          let htmlReadStream = fs.createReadStream(filePath, 'utf-8');
          htmlReadStream.on('data', chunk => {
            fileContent += chunk;
          });
          htmlReadStream.on('end', () => {
            template = template.replace(component[0], fileContent);

            const writeHtmlStream = fs.createWriteStream(path.normalize(path.join(path.normalize(path.join(__dirname, 'project-dist')), 'index.html')));
            writeHtmlStream.write(template);
          });
        }
      });
    });
  }
});
// }

async function buildPage() {
  await copyAssetsFolder();
  await mergeStyles();
}
buildPage();