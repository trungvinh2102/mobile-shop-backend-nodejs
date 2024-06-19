const { Types } = require('mongoose')

const convertToObject = id => new Types.ObjectId(id)

module.exports = {
  convertToObject
}