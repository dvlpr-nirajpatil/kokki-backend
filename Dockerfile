FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=production

EXPOSE 3000

<<<<<<< Updated upstream
CMD ["npm", "run", "start:production"]
=======
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/health').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["npm", "start"]




#-----------------------

# Use a lightweight Node.js 22 Alpine Linux image
FROM node:22-alpine

# Set the working directory inside the container
# All following commands will run inside /app
WORKDIR /app


# ---------------------------------------------------
# 1. Copy package files first
# ---------------------------------------------------
# We copy package.json and package-lock.json before
# copying the complete source code.
#
# Why?
# Docker can cache the dependency installation layer.
# If your source code changes but package.json does not,
# Docker does not need to run npm ci again.
COPY package*.json ./


# ---------------------------------------------------
# 2. Install ONLY production dependencies
# ---------------------------------------------------
# --omit=dev means:
# Do not install devDependencies such as:
# - nodemon
# - eslint
# - testing libraries
# - development tools
#
# This reduces:
# - Docker image size
# - security attack surface
# - unnecessary packages in production
RUN npm ci --omit=dev


# ---------------------------------------------------
# 3. Copy application source code
# ---------------------------------------------------
# Copy the remaining application files into /app.
#
# IMPORTANT:
# Make sure you have a proper .dockerignore file,
# otherwise unnecessary files like .git, node_modules,
# local env files, logs, etc. may be copied.
COPY . .


# ---------------------------------------------------
# 4. Set production environment
# ---------------------------------------------------
# NODE_ENV=production tells Node.js libraries that
# the application is running in production mode.
ENV NODE_ENV=production

# Default application port.
# Your external production environment can still
# override this value if needed.
ENV PORT=3000


# ---------------------------------------------------
# 5. Create a non-root user
# ---------------------------------------------------
# By default, containers may run as root.
#
# Running the Node.js application as a non-root user
# is safer because even if the application is
# compromised, the attacker gets fewer privileges.
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup


# ---------------------------------------------------
# 6. Give application files to the non-root user
# ---------------------------------------------------
# The appuser should be able to read/access the files
# required by the Node.js application.
RUN chown -R appuser:appgroup /app


# ---------------------------------------------------
# 7. Document the application's port
# ---------------------------------------------------
# EXPOSE does NOT actually publish the port.
# It simply documents that this container expects
# the application to listen on port 3000.
EXPOSE 3000


# ---------------------------------------------------
# 8. Docker health check
# ---------------------------------------------------
# Docker periodically calls:
#
#     http://127.0.0.1:3000/health
#
# If your API returns a non-2xx response or the
# request fails, Docker marks the container unhealthy.
#
# Our Kokki deployment script uses this health status
# to determine whether a deployment succeeded.
#
# If a new deployment becomes unhealthy,
# our deployment script can automatically rollback
# to the previous Docker image.
HEALTHCHECK \
    --interval=30s \
    --timeout=5s \
    --start-period=15s \
    --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/health').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"


# ---------------------------------------------------
# 9. Switch from root to non-root user
# ---------------------------------------------------
# Everything after this line runs as appuser.
USER appuser


# ---------------------------------------------------
# 10. Start the Node.js application
# ---------------------------------------------------
# This runs:
#
#     npm start
#
# For Kokki, package.json should contain something like:
#
# "scripts": {
#   "start": "node server.js"
# }
CMD ["npm", "start"]
>>>>>>> Stashed changes
