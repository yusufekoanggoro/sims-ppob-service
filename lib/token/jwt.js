require('dotenv').config();
const jwt = require('jsonwebtoken');
const privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${process.env.PRIVATE_KEY}\n-----END RSA PRIVATE KEY-----`;
const publicKey = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`;

class Jwt {
    constructor() {
        this.signOptions = {
            algorithm: 'RS256',
            expiresIn: '12h'
        };
    }

    sign(payload, options = {}) {
        return jwt.sign(payload, privateKey, {
            ...this.signOptions,
            ...options
        });
    }

    verify(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    status: 108,
                    message: 'Token tidak tidak valid atau kadaluwarsa',
                    data: null,
                });
            }

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, publicKey, {
                algorithms: ['RS256'],
            });

            req.email = decoded.email;
            
            next();
        } catch (error) {
            console.log(error)
            res.status(401).json({
                status: 108,
                message: 'Token tidak valid atau kadaluwarsa',
                data: null,
            });
        }
    }  
}

module.exports = Jwt;