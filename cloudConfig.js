const cloudinary = require('cloudinary').v2;
const { string } = require('joi');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET_KEY

})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      alllowedFormats:["png","jpg","jpeg"]// supports promises as well
    },
  });


module.exports={
    cloudinary,
    storage
}