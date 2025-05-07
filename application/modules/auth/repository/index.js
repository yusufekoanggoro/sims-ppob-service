const db = require('../../../../lib/mysql'); 

class AuthRepository {
    async createUser(user) {
        try {
            const sql = 'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)';
            const result = await db.query(sql, [user.email, user.first_name, user.last_name, user.password]);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

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
}

module.exports = AuthRepository;