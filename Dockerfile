FROM node:18

# Tentukan working directory di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh source code ke dalam container
COPY . .

# Tentukan port yang digunakan (ubah jika berbeda)
EXPOSE 3000

CMD ["npm", "start"]