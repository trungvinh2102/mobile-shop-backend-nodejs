const { Schema, model } = require("../../common/database")();
const slugify = require('slugify')

const DOCUMENT_NAME = "Categories"
const COLLECTION_NAME = "categories"

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    category_slug: String,
    category_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME
    },
    category_left: {
      type: Number,
      default: 0
    },
    category_right: {
      type: Number,
      default: 0
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME

  }
);

categorySchema.pre('save', function (next) {
  this.category_slug = slugify(this.category_name, { lower: true })
  next()
})

module.exports = model(DOCUMENT_NAME, categorySchema);

