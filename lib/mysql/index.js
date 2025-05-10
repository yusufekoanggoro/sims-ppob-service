require('dotenv').config();
const mysql = require('mysql2');

class Database {
    constructor() {
        if (Database.instance) {
        return Database.instance;
        }

        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10),
            queueLimit: 0
        });

        Database.instance = this;
    }

    // Fungsi untuk memeriksa koneksi
    async checkConnection() {
        try {
        const connection = await this.pool.promise().getConnection();
        console.log('Database connected successfully.');
        connection.release();
        return 'Connection successful';
        } catch (err) {
        throw new Error('Connection failed: ' + err.message);
        }
    }

    // Fungsi untuk menjalankan query
    async query(sql, params = []) {
        try {
        const [results] = await this.pool.promise().execute(sql, params);
        return results;
        } catch (err) {
        throw new Error(err);
        }
    }

    async beginTransaction() {
        const connection = await this.pool.promise().getConnection();
        await connection.beginTransaction();

        return {
            connection,
            query: async (sql, params = []) => {
                const [results] = await connection.execute(sql, params);
                return results;
            },
            commit: async () => {
                await connection.commit();
                connection.release();
            },
            rollback: async () => {
                await connection.rollback();
                connection.release();
            }
        };
    }

    // Fungsi untuk menutup koneksi pool (biasa dipanggil saat aplikasi berhenti)
    close() {
        this.pool.end((err) => {
        if (err) {
            console.error('Error closing the database connection:', err);
        } else {
            console.log('Database connection closed.');
        }
        });
    }
}

module.exports = new Database();