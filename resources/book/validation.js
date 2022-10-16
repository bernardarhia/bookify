import Joi from "joi";

const bookSchema = Joi.object({
  title: Joi.string().min(3).required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
});
const bookValidationMiddleware = (schema) => {
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
      console.log(e);
      const errors = [];
      e.details.forEach((error) => {
        errors.push(error.message);
      });
      res.status(400).send({ errors });
    }
  };
};
export { bookValidationMiddleware, bookSchema };
