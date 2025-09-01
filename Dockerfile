FROM node:20-alpine

WORKDIR /app

# Install deps first (better layer cache)
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# R3F（react-three-fiber）とthree.js, dreiを依存関係競合を無視してインストール
RUN npm install @react-three/fiber three @react-three/drei --legacy-peer-deps

# Copy source
COPY . .

EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0"]
