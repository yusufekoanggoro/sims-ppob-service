const db = require('../../../../lib/mysql'); 

class TransactionRepository {

    async findUserById(id) {
        try {
            const sql = 'SELECT * FROM users WHERE id = ?';
            const rows = await db.query(sql, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async findUserByEmail(email) {
        try {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const rows = await db.query(sql, [email]);
            return rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateUserBalance(email, amount) {
        try {
            const updateSql = 'UPDATE users SET balance = balance + ? WHERE email = ?';
            await db.query(updateSql, [amount, email]);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    async insertTransaction(data) {
        try {
            const {
                invoice_number,
                user_id,
                service_code,
                transaction_type,
                total_amount,
            } = data;

            const insertSql = 'INSERT INTO transactions (invoice_number, user_id, service_code, transaction_type, total_amount, created_on) VALUES (?, ?, ?, ?, ?, NOW())';
            await db.query(insertSql, [invoice_number, user_id, service_code, transaction_type, total_amount]);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    async getLastInvoiceNumber(dateFormatted) {
        try {
            const rows = await db.query(
                `SELECT invoice_number FROM transactions WHERE invoice_number LIKE ? ORDER BY invoice_number DESC LIMIT 1`,
                [`INV${dateFormatted}-%`]
            );
            return rows;
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

}

module.exports = TransactionRepository;