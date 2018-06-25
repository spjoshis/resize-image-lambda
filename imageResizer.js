/** Resizer Class **/
const jimp             = require('jimp');
const https             = require('https');
const fs               = require('fs');
const DOWNLOAD_FILE    = './tmp/rawfile';
const RESIZE_FILE      = './images/resizedfile';
const IMG_DEFAULT_SIZE = 32;
const crypto = require("crypto");

module.exports.downloadAndResize = (event, context, lambdaCallback) => {
    if (!event.imgUrl) return lambdaCallback(new Error('missing image URL'));

    console.log('Request starts now');

    const operationStartAt = Date.now();
    const size             = event.imgSize || IMG_DEFAULT_SIZE;

    downloadFile(event.imgUrl, DOWNLOAD_FILE, (error) => {
        if (error) return lambdaCallback(error);

        fileSize(DOWNLOAD_FILE, (error, dlFileSize) => {
            if (error) return lambdaCallback(error);
            const randomStr = crypto.randomBytes(16).toString("hex");

            resizeImage(DOWNLOAD_FILE, RESIZE_FILE + '-' + randomStr + '.png', size, (error) => {
                if (error) return lambdaCallback(error);
        
                fileSize(RESIZE_FILE + '-' + randomStr + '.png', (error, rsFileSize) => {
                    lambdaCallback(null, {
                        ok: true,
                        dlFileSize,
                        rsFileSize
                    });
                    console.log(`Resize operation ends now, operation` + ` took ${Date.now() - operationStartAt}ms`);
                    console.log('Deleting original image` + ` now');
                    removeFile(DOWNLOAD_FILE, (error) => {
                        // Cannot call lambdaCallback
                        if (error) return console.error(error);
                    });
                });
            });
        });
    });
};

function downloadFile(url, destination, callback) {
    const file = fs.createWriteStream(destination);
    const request = https.get(url, (res) => {
        res.pipe(file);
    });
    request.once('error', (error) => callback(error));
    file.once('finish', () => callback());
}

function fileSize(filename, callback) {
    fs.stat(filename, (error, data) => {
        if (error) return callback(error);
        callback(null, data.size);
    });
}

function removeFile(filename, callback) {
    fs.unlink(filename, callback);
}

function resizeImage(filename, newFilename, size, callback) {
    jimp.read(filename, (error, image) => {
        if (error) return callback(error);
        image
            .resize(size, jimp.AUTO)
            .write(newFilename, callback);
    });
}
