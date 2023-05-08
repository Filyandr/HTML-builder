const path = require('path');
const fs = require('fs')
const fsPromises = require('fs/promises');
const { stdout } = process;

const pathFolder = path.resolve(__dirname, 'files');
const pathCopyFolder = path.resolve(__dirname, 'files-copy');

async function copyDirectory() {
  try {
    await fsPromises.rm(pathCopyFolder, { recursive: true, force: true });
    await fsPromises.mkdir(pathCopyFolder, { recursive: true }, () => {
      if (err) throw err;
    });

    const files = await fsPromises.readdir(pathFolder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.resolve(pathFolder, file.name);
        const fileCopyPath = path.resolve(pathCopyFolder, file.name);

        fs.copyFile(filePath, fileCopyPath, error => {
          if (error) throw error;
        });
      }}
  } catch (error) {
    console.log(`Can't copy directory: ${error}`);
  }
}
copyDirectory();