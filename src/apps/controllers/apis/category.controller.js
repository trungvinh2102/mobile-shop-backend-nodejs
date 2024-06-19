
const CategoryModel = require("../../models/category.model");
const pagination = require("../../../libs/pagination");
const ProductModel = require("../../models/product.model");
const { convertToObject } = require('../../../utils/index')

class CategoryController {

  // ------------------create new category--------------------
  static async createCategory(req, res, next) {
    try {
      const { name, parent_id } = req.body;

      const category = new CategoryModel({
        category_name: name,
        category_parentId: parent_id,
      });

      let rightValue;

      if (parent_id) {
        const parentCategory = await CategoryModel.findById(convertToObject(parent_id));
        console.log("CategoryController ~ createCategory ~ parentCategory:", parentCategory);
        if (!parentCategory) return res.status(404).json("Category not found!");

        rightValue = parentCategory.category_right;

        // Cập nhật các danh mục có category_right lớn hơn rightValue
        await CategoryModel.updateMany(
          { category_right: { $gte: rightValue } },
          { $inc: { category_right: 2 } }
        );

        // Cập nhật các danh mục có category_left lớn hơn rightValue
        await CategoryModel.updateMany(
          { category_left: { $gt: rightValue } },
          { $inc: { category_left: 2 } }
        );

        // Tìm giá trị max của category_right trong các danh mục cùng cấp và tăng lên 1
        const maxRightValue = await CategoryModel.findOne({ category_parentId: convertToObject(parent_id) })
          .select('category_right')
          .sort({ category_right: -1 });
        console.log("CategoryController ~ createCategory ~ maxRightValue:", maxRightValue);

        if (maxRightValue) {
          rightValue = maxRightValue.category_right + 1;
        }
      } else {
        // Nếu không có parent_id, đặt rightValue là 1
        rightValue = 1;
      }

      // Cập nhật category_left và category_right của danh mục mới
      category.category_left = rightValue;
      category.category_right = rightValue + 1;
      await category.save();

      console.log("CategoryController ~ createCategory ~ category:", category);
      res.status(201).json({
        status: "success",
        data: {
          docs: category,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  //------------- get all category ---------------------------
  static async getAllCategory(req, res, next) {
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = page * limit - limit;
    const categories = await CategoryModel.find({ category_parentId: null })
      .sort({ _id: 1 })
      .skip(skip)
      .limit(limit);
    res
      .status(200)
      .json({
        status: "success",
        filters: {
          page,
          limit
        },
        data: {
          docs: categories,
          pages: await pagination(CategoryModel, query, page, limit),
        },

      });
  }

  // -------------------get category by id --------------------------
  static async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json('Missing category ID');

      const parentCategory = await CategoryModel.findById(id);
      if (!parentCategory) return res.status(404).json('Category does not exist!');

      const childCategories = await CategoryModel.find({
        category_left: { $gt: parentCategory.category_left },
        category_right: { $lt: parentCategory.category_right }
      }).sort({ category_left: 1 });

      const result = [parentCategory, ...childCategories];

      res.status(200).json({
        status: 'success',
        data: {
          docs: result
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }



  // --------------------- get all product by category---------------
  static async getAllProductByCategory(req, res, next) {
    try {
      const { id } = req.params;
      const query = { category_id: id };
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 9;
      const skip = page * limit - limit;
      const products = await ProductModel.find(query)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        status: "success",
        filters: {
          page,
          limit
        },
        data: {
          docs: products,
          pages: await pagination(ProductModel, query, page, limit),
        },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

module.exports = CategoryController
