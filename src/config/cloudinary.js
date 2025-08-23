const { v2: cloudinary } = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name:"drxqs5l5z",
  api_key:"882227375531171",
  api_secret:"3FNe7evkzjAWRmazw5OjHfWqKBg",
});

module.exports = cloudinary;