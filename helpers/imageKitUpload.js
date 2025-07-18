const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadToImageKit(fileBuffer, fileName) {
  try {
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      extensions: [
        {
          name: "google-auto-tagging",
          maxTags: 5,
          minConfidence: 95,
        },
      ],
    });
    return result.url;
  } catch (error) {
    throw error;
  }
}

module.exports = uploadToImageKit; 