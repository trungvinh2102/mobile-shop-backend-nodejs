
const customersModel = require("../../models/customers.model")

class CustomerController {

  // ------------------update customer----------------------
  static async updateCustomer(req, res, next) {
    try {
      const { body } = req
      const customerByPhone = await customersModel.findOne({ phone: body.phone })
      if (customerByPhone && customerByPhone.email !== body.email) {
        return res.status(401).json("Customer phone exists!")
      }
      await customersModel.updateOne(
        { email: body.email },
        {
          $set: {
            fullName: body.fullName,
            phone: body.phone,
            address: body.address
          }
        }
      )

      return res.status(200).json("update customer successfully!")
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}

module.exports = CustomerController