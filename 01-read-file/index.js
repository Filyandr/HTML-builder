const fs = require('fs');
const readableStream = fs.createReadStream('text.txt', 'utf-8');
const { stdout } = process;
readableStream.on('data', chunk => stdout.write(chunk));
readableStream.on('error', error => console.log('Error', error.message));