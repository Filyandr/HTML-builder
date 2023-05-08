const path = require('path');
const fs = require('fs')
const fsPromises = require('fs/promises');
const { stdout } = process;

const secretPath = path.resolve(__dirname, 'secret-folder');

async function readDirectory() {
    try {
        const files = await fsPromises.readdir(secretPath, { withFileTypes: true });
        for (const file of files) {
            if (file.isFile()) {
            const filePath = path.resolve(secretPath, file.name);

        fs.stat(filePath, (err, stats) => {
          if (err) throw err;
          if (stats.isFile()) {
            const fileType = path.extname(file.name).slice(1);
            const fileSize = Math.round(stats.size/1024, 1);
            const fileName = path.parse(filePath).name;
            stdout.write(`${fileName} - ${fileType} - ${fileSize}kb \n`);
          }
        });
      }
    }
} catch (error) {
    console.log(`Can't read directory: ${error}`);
}
}
readDirectory()