# Lambda Function to Resize the Image from URL

Writter lambda function will download image from URL and resize it into specific width. It will be used for resizing the images by uploading it on AWS Lambda function and API gateway.


It sets height of image automatically as per aspect ratio. it uses `jimp` package to resize the image in different resolutions.

**Installation**

**Step-1:** Clone the app using `git clone <Repository URL>`

**Step-2:** Install packages by hitting `npm install` command on root folder of app.



<br /><br />
**Usage for Testing**

`cd <project directory>`

`node ./index.js <Image URL> <Image Size>`

`Eg. node ./index.js https://example.com/image.png 300`
