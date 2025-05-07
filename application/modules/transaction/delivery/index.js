class TransactionHandler {

    constructor(transactionUsecase) {
        this.transactionUsecase = transactionUsecase;
    }
    
    async getBalance(req, res) {
        try {
            const result = await this.transactionUsecase.getBalance(req.email);
            res.status(200).json({
                status: 0,
                message: 'Get Balance Berhasil',
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

    async topUp(req, res) {
        try {
            const result = await this.transactionUsecase.updateUserBalance({ email: req.email, amount: req.body.top_up_amount });
            
            res.status(200).json({
                status: 0,
                message: 'Top Up Balance berhasil',
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

    async transaction(req, res) {

    }

    async transactionHistory(req, res) {

    }

}

module.exports = TransactionHandler;