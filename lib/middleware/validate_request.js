const Joi = require('joi');

const validateRegisterRequest = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        password: Joi.string().min(8).required(),
    });

    const { error, value  } = schema.validate(req.body);
    if (error) {
      return res.status(102).json({ message: 'Paramter email tidak sesuai format' });
    }

    req.body = value;

    next();
};

const validateLoginRequest = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(102).json({ message: 'Paramter email tidak sesuai format' });
    }
    
    req.body = value;

    next();
};

const validateUpdateProfileRequest = (req, res, next) => {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(102).json({ message: 'Paramter email tidak sesuai format' });
    }

    req.body = value;

    next();
};
  
module.exports = { 
    validateRegisterRequest,
    validateLoginRequest,
    validateUpdateProfileRequest,
};