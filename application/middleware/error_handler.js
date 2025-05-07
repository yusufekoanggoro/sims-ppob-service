const multer = require('multer');

const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        let message = 'Terjadi kesalahan pada upload';

        if (err.code === 'LIMIT_FILE_SIZE') {
            message = 'Ukuran file terlalu besar. Maksimal 2MB.';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            message = 'Format Image tidak sesuai';
        }

        return res.status(400).json({
            status: 102,
            message,
            data: null
        });
    }

    // Error lainnya
    return res.status(500).json({
        status: 500,
        message: 'Terjadi kesalahan pada server',
        data: null
    });
};

module.exports = errorHandler;