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
        return res.status(400).json({
            status: 102,
            message: 'Paramter email tidak sesuai format',
            data: null,
        });
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
        return res.status(400).json({
            status: 102,
            message: 'Paramter email tidak sesuai format',
            data: null,
        });
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
        return res.status(400).json({
            status: 102,
            message: 'Paramter email tidak sesuai format',
            data: null,
        });
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
        return res.status(400).json({
            status: 102,
            message: 'Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0',
            data: null,
        });
    }

    req.body = value;

    next();
};

const validateTransactionRequest = (req, res, next) => {
    const schema = Joi.object({
        service_code: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 102,
            message: 'Service ataus Layanan tidak ditemukan',
            data: null,
        });
    }

    req.body = value;

    next();
};

const validateTransactionHistoryRequest = (req, res, next) => {
    const schema = Joi.object({
        limit: Joi.string().optional(),
        offset: Joi.string().when('limit', {
            is: Joi.exist(),
            then: Joi.required(),  // 'offset' wajib diisi jika 'limit' ada
            otherwise: Joi.forbidden()  // 'offset' tidak boleh ada jika 'limit' tidak ada
        }),
    });

    const { error, value } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({ status: 102, message: 'Bad Request', data: null });
    }
    
    req.query = value;

    next();
};
  
module.exports = { 
    validateRegisterRequest,
    validateLoginRequest,
    validateUpdateProfileRequest,
    validateTopupRequest,
    validateTransactionRequest,
    validateTransactionHistoryRequest,
};