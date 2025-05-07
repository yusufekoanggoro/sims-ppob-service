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

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(102).json({ message: 'Paramter email tidak sesuai format' });
    }

    req.body = value;

    next();
};

const validateTopupRequest = (req, res, next) => {
    const schema = Joi.object({
        top_up_amount: Joi.number().greater(-1).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(102).json({ message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0' });
    }

    req.body = value;

    next();
};

const validateTransactionRequest = (req, res, next) => {
    const schema = Joi.object({
        service_code: Joi.string().required(),
        amount: Joi.number().greater(-1).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(102).json({ message: 'Service ataus Layanan tidak ditemukan' });
    }

    req.body = value;

    next();
};
  
module.exports = { 
    validateRegisterRequest,
    validateLoginRequest,
    validateUpdateProfileRequest,
    validateTopupRequest,
    validateTransactionRequest,
};