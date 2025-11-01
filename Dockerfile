# Base image with Node.js
FROM node:22-bookworm-slim

# Install Tectonic LaTeX engine
RUN apt-get update \
    && apt-get install -y --no-install-recommends tectonic ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Environment
ENV PORT=3002
ENV TECTONIC_PATH=/usr/bin/tectonic

EXPOSE 3002

CMD ["npm", "start"]
