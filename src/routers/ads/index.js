const express = require("express");
const AdsController = require("../../apps/controllers/apis/ads.controller");
const { uploadDisk } = require("../../common/multer");
const router = express.Router();



router.post('', uploadDisk.single('file'), AdsController.createAds)
router.get('', AdsController.getAllAds)

module.exports = router