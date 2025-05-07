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
            console.log(email, amount)
            const updateSql = 'UPDATE users SET balance = balance + ? WHERE email = ?';
            await db.query(updateSql, [amount, email]);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

}

module.exports = TransactionRepository;