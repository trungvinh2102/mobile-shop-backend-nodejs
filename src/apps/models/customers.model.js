const { Schema, model } = require("../../common/database")();

const DOCUMENT_NAME = "Customers"
const COLLECTION_NAME = "customers"

const customersShema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      unique: true,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
)


module.exports = model(DOCUMENT_NAME, customersShema)