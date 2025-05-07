require('dotenv').config();

class TransactionUsecase {
    
    constructor(transactionRepository) {
      this.transactionRepository = transactionRepository;
    }
  
    async getBalance(email) {
        try {
            const foundUser = await this.transactionRepository.findUserByEmail(email);
            return { balance: foundUser.balance };
        } catch (error) {
            throw error;
        }
    }

    async updateUserBalance(payload) {
        try {
            await this.transactionRepository.updateUserBalance(payload.email, payload.amount);
            
            const foundUser = await this.transactionRepository.findUserByEmail(payload.email);

            return { balance: foundUser.balance };
        } catch (error) {
            throw error;
        }
    }
  
    
}

module.exports = TransactionUsecase;