const db = require('../../../../lib/mysql'); 

class UserRepository {

    async findUserByEmail(email) {
        try {
            const sql = 'SELECT * FROM users WHERE email = ?';
            const rows = await db.query(sql, [email]);
            return rows[0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateProfile(email, updatedData) {
        try {
            const fields = [];
            const values = [];
    
            for (const key in updatedData) {
                fields.push(`${key} = ?`);
                values.push(updatedData[key]);
            }
    
            const sql = `UPDATE users SET ${fields.join(', ')} WHERE email = ?`;
            values.push(email);
    
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = UserRepository;