const Joi = require("joi");

const cartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().required(),
});


const cartValidationMiddleware = (schema) => {
  return async (req, res, next) => {
    const validationsOptions = {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    };

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
module.exports = { cartSchema,cartValidationMiddleware };
