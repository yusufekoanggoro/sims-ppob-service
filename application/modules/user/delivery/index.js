class UserHandler {

    constructor(userUsecase) {
        this.userUsecase = userUsecase;
    }
    
    async getProfile(req, res) {
        try {
            const result = await this.userUsecase.getProfile(req.email);
            
            res.status(200).json({
                status: 0,
                message: 'Sukses',
                data: result,
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

    async updateProfile(req, res) {
        try {
            const result = await this.userUsecase.updateProfile({ ...req.body, email: req.email });
            
            res.status(200).json({
                status: 0,
                message: 'Update Pofile berhasil',
                data: result,
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

    async updateProfileImage(req, res) {
        try {
            const result = await this.userUsecase.updateProfileImage({ filename: req.file.filename, email: req.email });
            
            res.status(200).json({
                status: 0,
                message: 'Update Profile Image berhasil',
                data: result,
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

module.exports = UserHandler;