const { Schema, model } = require("../../common/database")();

const DOCUMENT_NAME = "Products"
const COLLECTION_NAME = "products"

const productSchema = new Schema(
  {
    name: {
      type: String,
      text: true,
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Categories"
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    accessories: {
      type: String,
      required: true,
    },
    promotion: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    is_stock: {
      type: Boolean,
      default: true,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    specifications: [
      {
        screen_size: {
          type: String,
          default: ""
        },
        screen_technology: {
          type: String,
          default: ""
        },
        camera_after: {
          type: String,
          default: ""
        },
        camera_before: {
          type: String,
          default: ""
        },
        chipset: {
          type: String,
          default: ""
        },
        ram: {
          type: String,
          default: ""
        },
        memory: {
          type: String,
          default: ""
        },
        pin: {
          type: String,
          default: ""
        },
        sim: {
          type: String,
          default: ""
        },
        os: {
          type: String,
          default: ""
        },
        screen_resolution: {
          type: String,
          default: ""
        }
      }
    ]
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

module.exports = model(DOCUMENT_NAME, productSchema);