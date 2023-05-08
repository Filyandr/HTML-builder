const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

const filePath = path.resolve(__dirname, 'text.txt');
fs.open((filePath), 'w', (err) => {
    if(err) throw err;
    console.log('file sozdan');
})

stdout.write('Bonjour! \nВведите текст, он добавится в "text.txt"\n');

stdin.on("data", (data) => {
    if (data.toString().trim().toLowerCase() === 'exit') {
        stdout.write('Счастливо!');
        process.exit();
    } else {
    fs.appendFile((filePath), data, (err) => {
        if (err) throw err;
    });
}
});

process.on('SIGINT', () => {
    stdout.write('Счастливо!');
    process.exit();
})
