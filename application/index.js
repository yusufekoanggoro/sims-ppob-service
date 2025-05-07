const express = require('express');
const bodyParser = require('body-parser');
const db = require('../lib/mysql');
const Jwt = require('../lib/token/jwt');

const AuthHandler = require('./modules/auth/delivery');
const validateRequest = require('../lib/middleware/validate_request');
const AuthUsecase = require('./modules/auth/usecase');
const AuthRepository = require('./modules/auth/repository');

const UserHandler = require('./modules/user/delivery');
const UserRepository = require('./modules/user/repository');
const UserUsecase = require('./modules/user/usecase');

const InformationHandler = require('./modules/information/delivery');
const InformationRepository = require('./modules/information/repository');
const InformationUsecase = require('./modules/information/usecase');

const TransactionHandler = require('./modules/transaction/delivery');
const TransactionRepository = require('./modules/transaction/repository');
const TransactionUsecase = require('./modules/transaction/usecase');

const upload = require('../lib/middleware/multer_upload');
const errorHandler = require('../lib/middleware/error_handler');
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
const userUsecase = new UserUsecase(userRepository);
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
    validateRequest.validateUpdateProfileRequest,
    (req, res) => userHandler.updateProfile(req, res)
);

app.put(
    '/profile/image', 
    jwt.verify, 
    upload.single('image'),
    (req, res) => userHandler.updateProfileImage(req, res)
);

const informationRepository = new InformationRepository();
const informationUsecase = new InformationUsecase(informationRepository);
const informationHandler = new InformationHandler(informationUsecase);

app.get(
    '/banner', 
    (req, res) => informationHandler.getBanners(req, res)
);

app.get(
    '/services', 
    (req, res) => informationHandler.getServices(req, res)
);

// Module Transaction
const transactionRepository = new TransactionRepository();
const transactionUsecase = new TransactionUsecase(transactionRepository);
const transactionHandler = new TransactionHandler(transactionUsecase);

app.get(
    '/balance', 
    jwt.verify,
    (req, res) => transactionHandler.getBalance(req, res)
);

app.get(
    '/topup', 
    jwt.verify,
    validateRequest.validateTopupRequest,
    (req, res) => transactionHandler.topUp(req, res)
);

// app.get(
//     '/services', 
//     (req, res) => informationHandler.getServices(req, res)
// );


app.use(errorHandler);

process.on('SIGINT', () => {
    db.close();
    process.exit();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
