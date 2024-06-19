const JWT = require('jsonwebtoken')
const config = require('config')

exports.verifyAuthenticationCustomer = (req, res, next) => {

  const { token } = req.headers
  console.log("token:", token);

  if (token) {
    const verifyToken = token.split(" ")[1]
    // verify token
    JWT.verify(
      verifyToken,
      config.get("app.jwtAccessKey"),
      (error, decode) => {
        if (error) {
          return res.status(401).json("Authentication failed!")
        }
        next()
      })
  } else {
    return res.status(403).json('Authentication required!')
  }

}