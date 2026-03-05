FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Gunakan npm ci untuk instalasi yang lebih bersih dan cepat di CI/CD
RUN npm ci 
COPY . .
# Pastikan env variabel build-time tersedia jika diperlukan
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Hanya ambil file yang diperlukan untuk menjalankan aplikasi
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]