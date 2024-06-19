const { Schema, model } = require("../../common/database")();

const DOCUMENT_NAME = "Orders"
const COLLECTION_NAME = "orders"

const orderSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: Number,
      default: 2
    },
    customer_id: {
      type: String,
      required: true
    },
    is_delete: {
      type: Boolean,
      default: false
    },
    items: [
      {
        prd_id: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: false
        },
        image: {
          type: String,
          required: false
        }
      }
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);


module.exports = model(DOCUMENT_NAME, orderSchema)