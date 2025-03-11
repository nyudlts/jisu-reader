FROM node:22

# Enable pnpm
RUN corepack enable

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock file to install dependencies
COPY package.json pnpm-lock.yaml ./

# Make a directoy for readium submodules
RUN mkdir -p /app/src/readium/
COPY ./src/readium/ ./src/readium/

# Remove any existing node_modules directories
RUN find /app -type d -name "node_modules" -exec rm -rf {} +

# Install dependencies
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Build the application
RUN pnpm run build:all

# Expose the port the reader will run on
EXPOSE 3000

# Start the application in production mode
CMD ["pnpm", "run", "start"]
