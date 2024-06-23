
const OrderModel = require("../../models/order.model");
const ProductModel = require("../../models/product.model");
const transporter = require("../../../libs/mail");
const _ = require("lodash");
const ejs = require("ejs");
const path = require("path");
const productModel = require("../../models/product.model");
const pagination = require("../../../libs/pagination");


exports.order = async (req, res) => {
  const body = req.body;
  let totalPrice = 0;
  totalPrice = body.items.reduce((total, item) => total + item.qty * item.price, 0);
  const order = {
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    address: body.address,
    totalPrice,
    items: body.items,
    customer_id: body.customer_id
  };
  await OrderModel(order).save();
  const idsPrd = body.items.map((item) => item.prd_id);
  const products = await ProductModel.find({ _id: { $in: idsPrd } }).lean();
  let items = [];
  for (let prd of products) {
    const cart = _.find(body.items, {
      prd_id: prd._id.toString()
    });
    if (cart) {
      cart.name = prd.name;
      items.push(cart);
    }
  }
  // console.log(items);

  const html = await ejs.renderFile(path.join(req.app.get("views"), "mail.ejs"), {
    fullName: body.fullName,
    phone: body.phone,
    address: body.address,
    totalPrice,
    items,
  });
  await transporter.sendMail({
    from: '"Mobile Shop" <work.trungvinh@gmail.com>',
    to: `work.trungvinh@gmail.com, ${body.email}`,
    subject: "Xác nhận đơn hàng từ Mobile Shop",
    html,
  });

  res
    .status(201).json({
      status: "success",
      message: "Create order successfully",
    });
}

exports.orderByCustomer = async (req, res) => {
  try {
    const { id } = req.params
    const limit = parseInt(req.query.limit) || 6;
    const page = parseInt(req.query.page) || 1;
    const skip = page * limit - limit;
    const orderByCustomer = await OrderModel
      .find({ customer_id: id })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)

    return res.status(200).json({
      data: {
        docs: orderByCustomer,
        // pages: await pagination(OrderModel, query, page, limit)
      }

    });

  } catch (error) {
    return res.status(500).json(error)
  }
}

exports.orderDetails = async (req, res) => {
  try {
    const { id } = req.params
    const order = await OrderModel.findById(id)
    const { items } = order

    const prds_id = items.map((item) => item.prd_id)
    const products = await productModel.find({ _id: { $in: prds_id } })

    let newItems = []

    for (let product of products) {
      const obj = _.find(items, {
        prd_id: product._id.toString(),
      })
      if (obj) {
        obj.name = product.name
        obj.image = product.image
        newItems.push(obj)
      }
    }

    return res.status(200).json({
      newItems
    })
  } catch (error) {
    return res.status(500).json(error)
  }
}


exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params
    await OrderModel.updateOne({
      _id: id,
    }, {
      $set: { status: 0 }
    }, { new: true })

    return res.status(200).json("Cancel order sucessfully!")

  } catch (error) {
    return res.status(500).json(error)
  }
}