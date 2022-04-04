FROM node:12-alpine

LABEL name="Stakater Cloud Documentation" \
      maintainer="Stakater <hello@stakater.com>" \
      vendor="Stakater" \
      release="1" \
      summary="Documentation for Stakater Cloud"

# set workdir
RUN mkdir -p $HOME/application
WORKDIR $HOME/application

# copy the entire application
COPY --chown=1001:root . .

# download the application dependencies
RUN npm ci

# build the application
RUN npm run build

# Change ownership of cache to make it writable
RUN chown -R 1001 ~/.cache

# Change permissions to fix EACCESS permission error
RUN chmod -R 755 $HOME

# set non-root user
USER 1001

ENTRYPOINT ["npm", "run", "serve"]
