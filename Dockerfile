FROM node:20-alpine
RUN apk add --no-cache openssl libc6-compat netcat-openbsd postgresql-client
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]
