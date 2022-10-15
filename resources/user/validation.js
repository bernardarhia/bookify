const Joi = require("joi")

const authenticationSchema = Joi.object({
    username:Joi.string().min(3).required(),
    password:Joi.string().min(8).max(16).required()
})

const userValidationMiddleware = (schema) => {
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
  
  module.exports = userValidationMiddleware;
  
module.exports = {userValidationMiddleware, authenticationSchema}