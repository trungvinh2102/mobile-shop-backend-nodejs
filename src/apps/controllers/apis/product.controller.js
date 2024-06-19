
const ProductModel = require("../../models/product.model");
const CommentModel = require("../../models/comment.model");
const pagination = require("../../../libs/pagination");
const commentModel = require("../../models/comment.model");
const { convertToObject } = require("../../../utils");

exports.index = async (req, res) => {
  const query = {};
  // Text Search
  const name = req.query.name || "";
  if (name) {
    query.$text = { $search: name }
  }
  // Logic Query
  // query.is_featured = req.query.is_featured || false;
  // query.is_stock = req.query.is_stock || true;
  if (req.query.is_featured) {
    query.is_featured = req.query.is_featured;
  }
  if (req.query.is_stock) {
    query.is_stock = req.query.is_stock;
  }

  // Pagination
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = page * limit - limit;
  const products = await ProductModel.find(query)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)

  res.status(200).json({
    status: "success",
    filters: {
      is_featured: query.is_featured,
      is_stock: query.is_stock,
      page,
      limit,
    },
    data: {
      docs: products,
      pages: await pagination(ProductModel, query, page, limit),
    },
  });
}

exports.show = async (req, res) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id);
  res
    .status(200)
    .json({
      status: "success",
      data: product,
    });
}

exports.comments = async (req, res) => {
  const query = {};
  query.cmt_product_id = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = page * limit - limit;
  const comments = await CommentModel.find(query)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit);
  res
    .status(200)
    .json({
      status: "success",
      data: {
        docs: comments,
        pages: await pagination(CommentModel, query, page, limit),
      },
    });
}

exports.storeComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, content, parent_id } = req.body;

    const comment = new commentModel({
      cmt_user_name: name,
      cmt_user_email: email,
      cmt_content: content,
      cmt_product_id: id,
      cmt_parent_id: parent_id
    })

    let rightValue;
    if (parent_id) {
      const parentComment = await CommentModel.findById(convertToObject(parent_id))
      if (!parentComment) return res.status(404).json(`Comment doen't exists!`)

      rightValue = parentComment.cmt_right

      await commentModel.updateMany({
        cmt_product_id: id,
        cmt_right: { $gte: rightValue }
      }, { $inc: { cmt_right: 2 } })

      await commentModel.updateMany({
        cmt_product_id: id,
        cmt_left: { $gt: rightValue }
      }, { $inc: { cmt_left: 2 } })
    } else {
      const maxRightValue = await commentModel
        .findOne({ cmt_parent_id: convertToObject(parent_id) })
        .select('cmt_right')
        .sort({ cmt_right: -1 })

      if (maxRightValue) {
        rightValue = maxRightValue.cmt_right + 1
      } else {
        rightValue = 1
      }
    }

    comment.cmt_left = rightValue;
    comment.cmt_right = rightValue + 1

    await comment.save()

    res
      .status(201)
      .json({
        status: "success",
        message: "create comment successfully",
        docs: comment
      });
  } catch (error) {
    return res.status(500).json(error)
  }
}
