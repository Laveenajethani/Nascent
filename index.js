console.log('AWS');
const AWS = require('aws-sdk');
var access_key;
var secret_key;

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    access_key =  AWS.config.credentials.accessKeyId
    secret_key =  AWS.config.credentials.secretAccessKey;
  }
});

//console.log('access_key >> '+access_key);
//console.log('secret_key >> '+secret_key);

const imageUpload = async (base64) => {
  
  // You can either "yarn add aws-sdk" or "npm i aws-sdk"
  const AWS = require('aws-sdk');

  // Configure AWS with your access and secret key.
  const ACCESS_KEY_ID = access_key;
  const SECRET_ACCESS_KEY =  secret_key;
  const AWS_REGION = 'ap-south-1';
  const S3_BUCKET = 'images.upload.photo.capture';

  //console.log('ACCESS_KEY_ID >> '+ACCESS_KEY_ID);
  // Configure AWS to use promise
  AWS.config.setPromisesDependency(require('bluebird'));
  AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });

  // Create an s3 instance
  const s3 = new AWS.S3();

  // Ensure that you POST a base64 data to your server.
  // Let's assume the variable "base64" is one.
  const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  console.log('base64Data >> '+base64Data);

  // Getting the file type, ie: jpeg, png or gif
  const type = base64.split(';')[0].split('/')[1];
  console.log('type >> '+type);

  // Generally we'd have an userId associated with the image
  // For this example, we'll simulate one
  const userId = 1;

  // With this setup, each time your user uploads an image, will be overwritten.
  // To prevent this, use a different Key each time.
  // This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
  const params = {
    Bucket: S3_BUCKET,
    Key: `${userId}.${type}`, // type is not required
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64', // required
    ContentType: `image/${type}` // required. Notice the back ticks
  }

  console.log(params);

  // The upload() is used instead of putObject() as we'd need the location url and assign that to our user profile/database
  // see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
  s3.upload (params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Upload Success", data.Location);
    }
  });
  
  // Save the Location (url) to your database and Key if needs be.
  // As good developers, we should return the url and let other function do the saving to database etc
  
  // To delete, see: https://gist.github.com/SylarRuby/b3b1430ca633bc5ffec29bbcdac2bd52
}

imageUpload(""); /* At parameter pass base64 data of user face*/