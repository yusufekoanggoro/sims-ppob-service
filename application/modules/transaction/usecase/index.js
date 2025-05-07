require('dotenv').config();
const db = require('../../../../lib/mysql'); 
const moment = require('moment');

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
        const transaction = await db.beginTransaction();
        try {
            const foundUser = await this.transactionRepository.findUserByEmail(payload.email);
            if (!foundUser) {
                const error = new Error('Token tidak tidak valid atau kadaluwarsa');
                error.statusCode = 401;
                error.status = 108;
                error.data = null;
                throw error;
            }

            await this.transactionRepository.updateUserBalance(payload.email, payload.amount);

            const invoiceNumber = await this.generateInvoiceNumber();
            const data = {
                invoice_number: invoiceNumber,
                user_id: foundUser.id,
                service_code: null,
                transaction_type: 'TOPUP',
                total_amount: payload.amount
            };

            await this.transactionRepository.insertTransaction(data);

            await transaction.commit();

            return { balance: foundUser.balance + payload.amount };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async generateInvoiceNumber() {
        const dateFormatted = moment().format('DDMMYY');

        const rows = await this.transactionRepository.getLastInvoiceNumber(dateFormatted);

        // Default invoice_number jika tidak ada yang ditemukan
        let newInvoiceNumber = `INV${dateFormatted}-001`;
    
        if (rows.length > 0) {
            const lastInvoiceNumber = rows[0].invoice_number;
            const lastInvoiceSeqStr = lastInvoiceNumber.split('-').pop() ?? '000';
            const lastInvoiceSeq = parseInt(lastInvoiceSeqStr, 10);
            const newInvoiceSeq = lastInvoiceSeq + 1;

            if (newInvoiceSeq > 999) {
                throw new Error('Invoice number limit exceeded for the day');
            }

            const paddedSeq = newInvoiceSeq.toString().padStart(3, '0');
            newInvoiceNumber = `INV${dateFormatted}-${paddedSeq}`;
        }

        return newInvoiceNumber;
    }
  
    
}

module.exports = TransactionUsecase;