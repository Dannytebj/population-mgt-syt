const Joi = require('joi');

exports.validateLocation = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    maleResidents: Joi.number().required(),
    femaleResidents: Joi.number().required(),
    parentId: Joi.string().optional().allow(''),
    isNested: Joi.boolean().default(false).optional()
  });

  Joi.validate(req.body, schema, (error, data) => {

    if (error) {
      const message = error.details[0].message;
      res.status(400).send({ message });
    } else {
      next();
    }
  });
};
