const bcrypt = require('bcrypt');

class AuthUsecase {

    constructor(userRepository, jwt) {
      this.userRepository = userRepository;
      this.jwt = jwt;
    }
  
    async registerUser(user) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);

            user.password = hashedPassword;

            await this.userRepository.createUser(user);

            return
        } catch (error) {
            throw error;
        }
    }

    async login(user) {
        try {
            const foundUser = await this.userRepository.findUserByEmail(user.email);
            if (!foundUser) {
                const error = new Error('Username atau password salah');
                error.statusCode = 401;
                error.status = 103;
                error.data = null;
                throw error;
            }

            const isPasswordValid = await bcrypt.compare(user.password, foundUser.password);
            if (!isPasswordValid) {
                const error = new Error('Username atau password salah');
                error.statusCode = 401;
                error.status = 103;
                error.data = null;
                throw error;
            }

            const token = await this.jwt.sign({ id: foundUser.id, email: foundUser.email });
            return { token };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
  
}

module.exports = AuthUsecase;