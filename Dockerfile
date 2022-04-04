FROM node:14-alpine

LABEL name="Stakater Cloud Documentation" \
      maintainer="Stakater <hello@stakater.com>" \
      vendor="Stakater" \
      release="1" \
      summary="Documentation for Stakater Cloud"

# set workdir
RUN mkdir -p $HOME/application
WORKDIR $HOME/application

# copy the entire application
COPY . .

# download the application dependencies
RUN npm ci

# build the application
RUN npm run build

# set non-root user
USER 1001

ENTRYPOINT ["npm", "run", "serve"]
