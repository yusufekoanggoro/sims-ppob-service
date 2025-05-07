const express = require('express');
const bodyParser = require('body-parser');
const AuthHandler = require('./modules/auth/delivery');
const validateRequest = require('./middleware/validate_request');
const AuthUsecase = require('./modules/auth/usecase');
const AuthRepository = require('./modules/auth/repository');
const db = require('../lib/mysql');
const Jwt = require('../lib/token/jwt');
const UserHandler = require('./modules/user/delivery');
const UserRepository = require('./modules/user/repository');
const UserUsecase = require('./modules/user/usecase');
const upload = require('./middleware/multer_upload');
const errorHandler = require('./middleware/error_handler');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const jwt = new Jwt();

const authRepository = new AuthRepository();
const authUsecase = new AuthUsecase(authRepository, jwt);
const authHandler = new AuthHandler(authUsecase);

app.post(
    '/registration', 
    validateRequest.validateRegisterRequest,
    (req, res) => authHandler.register(req, res)
);

app.post(
    '/login', 
    validateRequest.validateLoginRequest,
    (req, res) => authHandler.login(req, res)
);

const userRepository = new UserRepository();
const userUsecase = new UserUsecase(userRepository, jwt);
const userHandler = new UserHandler(userUsecase);

app.use('/uploads', express.static(path.join(__dirname, '..' ,'uploads')));

app.get(
    '/profile', 
    jwt.verify,
    (req, res) => userHandler.getProfile(req, res)
);

app.put(
    '/profile/update', 
    jwt.verify,
    (req, res) => userHandler.updateProfile(req, res)
);

app.put(
    '/profile/image', 
    jwt.verify, 
    upload.single('image'),
    (req, res) => userHandler.updateProfileImage(req, res)
);

app.use(errorHandler);

process.on('SIGINT', () => {
    db.close();
    process.exit();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
