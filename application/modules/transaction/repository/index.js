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

    async addUserBalance(email, amount, trx) {
        try {
            const updateSql = 'UPDATE users SET balance = balance + ? WHERE email = ?';
            const params = [amount, email];

            if (trx) {
                return await trx.query(updateSql, params);
            }

            await db.query(updateSql, params);
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    async insertTransaction(data, trx) {
        try {
            const {
                invoice_number,
                user_id,
                service_code,
                transaction_type,
                total_amount,
                description,
            } = data;

            const insertSql = 'INSERT INTO transactions (invoice_number, user_id, service_code, transaction_type, total_amount, description, created_on) VALUES (?, ?, ?, ?, ?, ?, NOW())';
            const params = [invoice_number, user_id, service_code, transaction_type, total_amount, description];

            if (trx) {
                return await trx.query(insertSql, params);
            }

            return await db.query(insertSql, params);
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

    async findServiceByCode(serviceCode) {
        try {
            const sql = 'SELECT * FROM services WHERE service_code = ?';
            const rows = await db.query(sql, [serviceCode]);
            return rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async getTransactionDetailByInvoiceNumber(invoiceNumber, trx) {
        try {
            const query = `
                SELECT 
                    t.invoice_number,
                    t.service_code,
                    s.service_name,
                    t.transaction_type,
                    t.total_amount,
                    t.created_on
                FROM 
                    transactions t
                JOIN 
                    users u ON t.user_id = u.id
                LEFT JOIN 
                    services s ON t.service_code = s.service_code
                WHERE 
                    t.invoice_number = ?
                LIMIT 1;
            `;
            const params = [invoiceNumber];
            
            if (trx) {
                return await trx.query(query, params);
            }

            const rows = await db.query(query, params);
            return rows[0] || null;
        } catch (error) {
            throw new Error(error);
        }
    }

    async subtractUserBalance(email, amount, trx) {
        try {
            const updateSql = 'UPDATE users SET balance = balance - ? WHERE email = ?';
            const params = [amount, email];

            if (trx) {
                return await trx.query(updateSql, params);
            }

            await db.query(updateSql, params);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async getTransactionDetailPaginated(userId, limit = 0, offset = 0) {
        try {
            let query = `
                SELECT 
                    t.invoice_number,
                    t.transaction_type,
                    t.description,
                    t.total_amount,
                    t.created_on
                FROM 
                    transactions t
                LEFT JOIN 
                    services s ON t.service_code = s.service_code
                WHERE 
                    t.user_id = ?
                ORDER BY 
                    t.created_on DESC
            `;

            const params = [userId];
            if (parseInt(limit) > 0) {
                // query += ` LIMIT ? OFFSET ?`;
                // params.push(parseInt(limit), parseInt(offset));
                const safeLimit = parseInt(limit, 10);
                const safeOffset = parseInt(offset, 10);
                query += ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;
            }

            const rows = await db.query(query, params);
            return rows;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

}

module.exports = TransactionRepository;