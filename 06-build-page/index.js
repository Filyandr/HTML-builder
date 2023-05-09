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
async function createHtml() {
  try {
    const template = await fsPromises.readFile(pathToTemplate, 'utf-8');
    const templateTags = template.match(/{{(\w+)}}/g);
    let result = template;

    for (const tag of templateTags) {
      const tagName = tag.slice(2, -2);
      const componentFileName = path.resolve(pathToComponents, `${tagName}.html`);
      try {
        const component = await fsPromises.readFile(componentFileName, 'utf-8');
        result = result.replace(tag, component);
      } catch (error) {
        console.log(error);
      }
    }
    await fsPromises.writeFile(path.resolve(pathToDist, 'index.html'), result);
  } catch (err) {
    console.error(err);
  }
}

async function buildPage() {
  await copyAssetsFolder();
  await mergeStyles();
  await createHtml();
}
buildPage();