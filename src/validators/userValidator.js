const joi = require("joi");

const userValidator = joi.object({
  first_name: joi.string().min(5).max(30).required(),
  last_name: joi.string().min(5).max(30).required(),
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const userValidatorMiddleware = async (req, res, next) => {
  const userPayload = req.body;
  try {
    await userValidator.validateAsync(userPayload);
    next();
  } catch (error) {
    console.log(error);
    return res.status(406).send(error.details[0].message);
  }
};

const loginValidator = joi.object({
  email: joi
    .string()
    .email({ maxDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

const loginValidatorMiddleware = async (req, res, next) => {
  const userPayload = req.body;
  try {
    await loginValidator.validateAsync(userPayload);
    next();
  } catch (error) {
    console.log(error);
    return res.status(406).send(error.details[0].message);
  }
};

module.exports = {
  userValidatorMiddleware,
  loginValidatorMiddleware,
};
