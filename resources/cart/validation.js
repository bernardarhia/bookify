const Joi = require("joi");

const cartSchema = Joi.object({
  productId: Joi.number().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
});
module.exports = { cartSchema };
