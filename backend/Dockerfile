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
    ENV NODE_ENV=production
    COPY package*.json ./
    RUN npm install --omit=dev
    COPY --from=build /app/dist ./dist
    EXPOSE 3001
    CMD ["node", "dist/main"]
    