const Joi = require("joi");

const validationsOptions = {
  abortEarly: false,
  stripUnknown: true,
  allowUnknown: true,
};
const cartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().required(),
});

const cartValidationMiddleware = (schema) => {
  return async (req, res, next) => {
 

    try {
      const value = await schema.validateAsync(req.body, validationsOptions);
      req.body = value;
      next();
    } catch (e) {
      const errors = [];
      e.details.forEach((error) => {
        errors.push(error.message);
      });
      res.status(400).send({ errors });
    }
  };
};
const checkoutMiddleware = (schema) => {
  return async (req, res, next) => {

    try {
      const value = await schema.validateAsync(req.body, validationsOptions);
      req.body = value;
      next();
    } catch (e) {
      const errors = [];
      e.details.forEach((error) => {
        errors.push(error.message);
      });
      res.status(400).send({ errors });
    }
  };
};

const checkoutSchema = Joi.object({
  products: {
    type: Joi.array().items(
      Joi.object({
        bookId: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
      })
    ),
    required: true,
  },
  shipping: {
    type: Joi.object({
      name: Joi.string().required(),
      address: Joi.string().required(),
    }),
    required: true,
  },
  payment: {
    type: Joi.object({
      method: Joi.string().required,
      transactionId: Joi.string().min(8).required,
    }),
    required: true,
  },
});
module.exports = {
  cartSchema,
  cartValidationMiddleware,
  checkoutMiddleware,
  checkoutSchema,
};
