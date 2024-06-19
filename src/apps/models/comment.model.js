const { Schema, model } = require("../../common/database")();

const DOCUMENT_NAME = "Comments"
const COLLECTION_NAME = "comments"

const commentSchema = new Schema(
  {
    cmt_user_name: {
      type: String,
      required: true,
    },
    cmt_user_email: {
      type: String,
      required: true,
    },
    cmt_content: {
      type: String,
      required: true,
    },
    cmt_product_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Products"
    },
    cmt_parent_id: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME
    },
    cmt_left: {
      type: Number,
      default: 0
    },
    cmt_right: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);


module.exports = model(DOCUMENT_NAME, commentSchema);