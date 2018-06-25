const handler = require('./imageResizer.js');

// Usage: ./index.js http://myweb.com/image.jpg <size=32>
const imgUrl = process.argv[2];
const imgSize = process.argv[3]
    ? Number(process.argv[3])
    : undefined;

handler.downloadAndResize({ imgUrl, imgSize }, {}, (error, data) => {
    if (error) return console.error('FAILURE', error.message);
    console.log('SUCCESS', data);
});