const { Schema, model } = require("../../common/database")();

const DOCUMENT_NAME = "Ads"
const COLLECTION_NAME = "ads"

const adSchema = new Schema(
  {
    ads_name: {
      type: String,
      required: true
    },
    ads_image: {
      type: String,
      required: true
    },
    ads_type: {
      type: String,
      required: true,
      enum: ['banner', 'slider']
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME

  }
)


module.exports = model(DOCUMENT_NAME, adSchema);