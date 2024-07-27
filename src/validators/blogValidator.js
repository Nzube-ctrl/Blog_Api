const joi = require("joi");

const blogValidator = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  body: joi.string().required(),
});

const blogValidatorMiddleWare = async (req, res, next) => {
  const blogPayload = req.body;
  try {
    await blogValidator.validateAsync(blogPayload);
    next();
  } catch (error) {
    return res.status(406).send(error.details[0].message);
  }
};

module.exports = blogValidatorMiddleWare;
