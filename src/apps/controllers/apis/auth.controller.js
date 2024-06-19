
const CustomersModel = require("../../models/customers.model")
const JWT = require('jsonwebtoken')
const config = require('config')
const customersModel = require("../../models/customers.model")
const bcrypt = require('bcrypt')


class AuthController {

  //----------------login customer -------------------
  static async loginCustomer(req, res, next) {
    try {
      const { body } = req
      const customer = await CustomersModel.findOne({ email: body.email })
      console.log("exports.loginCustomer= ~ customer:", customer);

      // check customer
      if (!customer) return res.status(401).json("Email not valid!");

      // check passwords
      const validPassword = await bcrypt.compare(body.password, customer.password)
      if (!validPassword) return res.status(401).json("Password not valid!");

      if (customer && validPassword) {

        // create new access token
        const accessToken = JWT.sign(
          {
            email: body.email,
            password: body.password
          },
          config.get('app.jwtAccessKey'),
          { expiresIn: "7d" }
        )

        // luu token len cookie
        res.cookie('tokenCustomer', accessToken)

        // destructuring customer
        const { password, ...others } = customer._doc

        return res.status(200).json({ ...others, accessToken })
      }
    } catch (error) {
      return res.status(500).json(error)
    }
  }

  // ----------------------register customer------------------
  static async registerCustomer(req, res, next) {
    try {
      const { body } = req
      const foundEmailCustomer = await customersModel.findOne({ email: body.email })
      if (foundEmailCustomer) return res.status(401).json(`Customer email exists!`)
      const foundPhoneCustomer = await customersModel.findOne({ phone: body.phone })
      if (foundPhoneCustomer) return res.status(401).json(`Customer phone exists!`)

      const hashPassword = await bcrypt.hash(body.password, 10)

      await new customersModel({
        fullName: body.fullName,
        email: body.email,
        password: hashPassword,
        phone: body.phone,
        address: body.address
      }).save()

      return res.status(201).json('Create new customer successfully!')

    } catch (error) {

    }
  }

}
module.exports = AuthController
