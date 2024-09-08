# Use the official Node.js image from the Docker Hub
FROM node:22-slim AS base

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Enable corepack and install dependencies
RUN corepack enable

# Create and set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Install all dependencies and build the application
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY out/ /app

# Final stage: copy necessary files and dependencies
FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY out/ /app

EXPOSE 3000

CMD [ "pnpm", "start" ]
