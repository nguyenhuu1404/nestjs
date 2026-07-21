# ---- development ----
    FROM node:20-alpine AS development
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    EXPOSE 3001
    CMD ["npm", "run", "start:dev"]
    
    # ---- build ----
    FROM node:20-alpine AS build
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    RUN npm run build
    
    # ---- production ----
    FROM node:20-alpine AS production
    WORKDIR /app

    RUN npm install -g pm2

    ENV NODE_ENV=production
    COPY package*.json ./
    RUN npm install --omit=dev
    COPY --from=build /app/dist ./dist
    COPY ecosystem.config.js ./

    EXPOSE 3001
   CMD ["pm2-runtime", "start", "ecosystem.config.js"]
    