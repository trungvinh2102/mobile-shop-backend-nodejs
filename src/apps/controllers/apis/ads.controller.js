const adModel = require("../../models/ads.model");
const cloudinary = require("../../../common/cloudinary");
const fs = require("fs");
const path = require("path");

const createAds = async (req, res, next) => {
  try {
    const { body, file } = req;

    // Validate required fields
    if (!body.name || !body.type) {
      return res.status(400).json({
        error: "ad_name and ad_type are required fields."
      });
    }

    if (!file) {
      return res.status(400).json({
        error: "ad_image is required."
      });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      // public_id: 'ads',
      folder: "ads"
    });

    const newAd = new adModel({
      ads_name: body.name,
      ads_type: body.type,
      ads_image: result.secure_url
    });

    await newAd.save();

    // Remove the file from the local filesystem
    fs.unlinkSync(file.path);

    return res.status(201).json({ newAd });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getAllAds = async (req, res, next) => {
  try {
    const ads = await adModel.find();
    return res.status(200).json({ ads });
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  createAds,
  getAllAds
};
