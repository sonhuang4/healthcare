FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Next.js needs to bind to 0.0.0.0 in Docker
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

