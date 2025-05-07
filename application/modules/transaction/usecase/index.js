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
        const trx = await db.beginTransaction();
        try {
            const foundUser = await this.transactionRepository.findUserByEmail(payload.email);
            if (!foundUser) {
                const error = new Error('Token tidak tidak valid atau kadaluwarsa');
                error.statusCode = 401;
                error.status = 108;
                error.data = null;
                throw error;
            }

            await this.transactionRepository.addUserBalance(payload.email, payload.amount, trx);

            const invoiceNumber = await this.generateInvoiceNumber();
            const data = {
                invoice_number: invoiceNumber,
                user_id: foundUser.id,
                service_code: null,
                transaction_type: 'TOPUP',
                total_amount: payload.amount,
                description: 'Top Up balance',
            };

            await this.transactionRepository.insertTransaction(data, trx);

            await trx.commit();

            return { balance: foundUser.balance + payload.amount };
        } catch (error) {
            await trx.rollback();
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

    async transaction(payload) {
        const trx = await db.beginTransaction();
        try {
            const foundUser = await this.transactionRepository.findUserByEmail(payload.email);
            if (!foundUser) {
                const error = new Error('Token tidak tidak valid atau kadaluwarsa');
                error.statusCode = 401;
                error.status = 108;
                error.data = null;
                throw error;
            }

            const foundService = await this.transactionRepository.findServiceByCode(payload.serviceCode);
            if (!foundService) {
                const error = new Error('Service ataus Layanan tidak ditemukan');
                error.statusCode = 400;
                error.status = 102;
                error.data = null;
                throw error;
            }

            // Validasi tarif layanan
            if (payload.amount !== foundService.service_tariff) {
                const error = new Error('Jumlah pembayaran tidak sesuai dengan tarif layanan');
                error.statusCode = 400;
                error.status = 110;
                error.data = {
                    expectedAmount: foundService.service_tariff,
                    receivedAmount: payload.amount
                };
                throw error;
            }

            // Validasi saldo mencukupi
            if (foundUser.balance < payload.amount) {
                const error = new Error('Saldo tidak mencukupi untuk melakukan transaksi');
                error.statusCode = 400;
                error.status = 109;
                error.data = null;
                throw error;
            }

            const invoiceNumber = await this.generateInvoiceNumber();
            const data = {
                invoice_number: invoiceNumber,
                user_id: foundUser.id,
                service_code: foundService.service_code,
                transaction_type: 'PAYMENT',
                total_amount: payload.amount,
                description: foundService.service_name,
            };

            await this.transactionRepository.insertTransaction(data, trx);

            const result = await this.transactionRepository.getTransactionDetailByInvoiceNumber(invoiceNumber, trx);

            await this.transactionRepository.subtractUserBalance(foundUser.email, payload.amount, trx);

            await trx.commit();

            return result;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }

    async transactionHistory(payload) {
        const trx = await db.beginTransaction();
        try {
            const foundUser = await this.transactionRepository.findUserByEmail(payload.email);
            if (!foundUser) {
                const error = new Error('Token tidak tidak valid atau kadaluwarsa');
                error.statusCode = 401;
                error.status = 108;
                error.data = null;
                throw error;
            }

            const offset = payload.offset;
            const limit = payload.limit;

            const transactions = await this.transactionRepository.getTransactionDetailPaginated(foundUser.id, limit, offset);

            return {
                offset: offset,
                limit: limit,
                records: transactions,
            };
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }
    
}

module.exports = TransactionUsecase;