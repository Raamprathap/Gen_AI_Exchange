# Base image with Node.js
FROM node:22-bookworm-slim

# Install dependencies and Tectonic (download static Linux binary from GitHub)
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl tar \
    && update-ca-certificates \
    && mkdir -p /tmp/tectonic \
    && curl -fsSL -o /tmp/tectonic/tectonic.tar.gz \
    https://github.com/tectonic-typesetting/tectonic/releases/latest/download/tectonic-x86_64-unknown-linux-gnu.tar.gz \
    && tar -xzf /tmp/tectonic/tectonic.tar.gz -C /tmp/tectonic \
    && mv /tmp/tectonic/tectonic /usr/bin/tectonic \
    && chmod +x /usr/bin/tectonic \
    && rm -rf /var/lib/apt/lists/* /tmp/tectonic

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
