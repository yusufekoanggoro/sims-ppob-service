const db = require('../../../../lib/mysql'); 

class InformationRepository {

    async getBanners() {
        try {
            const sql = 'SELECT * FROM banners';
            const result  = await db.query(sql);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getServices() {
        try {
            const sql = 'SELECT * FROM services';
            const result  = await db.query(sql);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = InformationRepository;