const bcrypt = require('bcrypt');
require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

class UserUsecase {
    
    constructor(userRepository, jwt) {
      this.userRepository = userRepository;
      this.jwt = jwt;
    }
  
    async getProfile(email) {
        try {
            const foundUser = await this.userRepository.findUserByEmail(email);
            if (!foundUser) {
                const error = new Error('Token tidak tidak valid atau kadaluwarsa');
                error.statusCode = 401;
                error.status = 108;
                error.data = null;
                throw error;
            }

            delete foundUser.id;
            delete foundUser.balance;
            delete foundUser.password;

            const baseUrl = `${process.env.BASE_URL}`;
            foundUser.profile_image = `${baseUrl}/${foundUser.profile_image}`
            
            return foundUser;
        } catch (error) {
            throw error;
        }
    }

    async updateProfile(user) {
        try {
            const { email, ...updatedData } = user;
   
            const updateUser = await this.userRepository.updateProfile(user.email, updatedData);
            if (!updateUser) {
                const error = new Error('Token tidak tidak valid atau kadaluwarsa');
                error.statusCode = 401;
                error.status = 108;
                error.data = null;
                throw error;
            }

            const foundUser = await this.userRepository.findUserByEmail(email);
            if (!foundUser) {
                const error = new Error('Token tidak tidak valid atau kadaluwarsa');
                error.statusCode = 401;
                error.status = 108;
                error.data = null;
                throw error;
            }

            delete foundUser.id;
            delete foundUser.balance;
            delete foundUser.password;
            
            return foundUser;
        } catch (error) {
            throw error;
        }
    }

    async updateProfileImage(payload) {
        try {
            const foundUser = await this.userRepository.findUserByEmail(payload.email);
            if (!foundUser) {
                const error = new Error('Token tidak tidak valid atau kadaluwarsa');
                error.statusCode = 401;
                error.status = 108;
                error.data = null;
                throw error;
            }

            if (foundUser.profile_image && foundUser.profile_image !== `uploads/${payload.filename}`){
                const oldImagePath = path.resolve(process.cwd(), foundUser.profile_image);
                try {
                    await fs.unlink(oldImagePath);
                    console.log(`Deleted old image: ${oldImagePath}`);
                } catch (err) {
                    console.warn(`Gagal menghapus file lama: ${oldImagePath}`, err.message);
                }
            }

            const updatedData = { 
                ...foundUser,
                profile_image: `uploads/${payload.filename}`,
            };

            const updateUser = await this.userRepository.updateProfile(payload.email, updatedData);
            if (!updateUser) {
                const error = new Error('Token tidak tidak valid atau kadaluwarsa');
                error.statusCode = 401;
                error.status = 108;
                error.data = null;
                throw error;
            }

            delete foundUser.id;
            delete foundUser.balance;
            delete foundUser.password;
            
            return { ...foundUser, profile_image: `${process.env.BASE_URL}/uploads/${payload.filename}` };
        } catch (error) {
            throw error;
        }
    }
  
}

module.exports = UserUsecase;