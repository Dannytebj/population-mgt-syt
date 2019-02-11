const Joi = require('joi');

exports.validateLocation = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    maleResidents: Joi.number().optional().allow(''),
    femaleResidents: Joi.number().optional().allow(''),
    parentId: Joi.string().optional().allow(''),
    isParent: Joi.boolean().default(false).optional()
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

exports.validateUpdateLocation = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    maleResidents: Joi.number().required(),
    femaleResidents: Joi.number().required(),
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

exports.validateParentUpdate = (req, res, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
  });

  Joi.validate(req.body, schema, (error, data) => {

    if (error) {
      const message = error.details[0].message;
      res.status(400).send({ message });
    } else {
      next();
    }
  });
}
