class AuthHandler {

    constructor(authUsecase) {
        this.authUsecase = authUsecase;
    }

    async register(req, res) {
        try {
            await this.authUsecase.registerUser(req.body);
            
            res.status(200).json({
                status: 0,
                message: 'Registrasi berhasil silahkan login',
                data: null,
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const status = error.status || 0;
            const message = error.message || 'Internal server error';
            const data = error.data || null

            res.status(statusCode).json({
                status: status,
                message: message,
                data: data,
            });
        }
    }

    async login(req, res) {
        try {
            const result = await this.authUsecase.login(req.body);

            res.status(200).json({ 
                status: 0,
                message: 'Login Sukses',
                data: {
                    token: result.token,
                },
            });
        } catch (error) {
            const statusCode = error.statusCode || 500;
            const status = error.status || 0;
            const message = error.message || 'Internal server error';
            const data = error.data || null;

            res.status(statusCode).json({
                status: status,
                message: message,
                data: data,
            });
        }
    }

}

module.exports = AuthHandler;