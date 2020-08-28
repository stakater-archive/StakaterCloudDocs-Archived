FROM registry.access.redhat.com/ubi8/nodejs-10

USER root

LABEL name="Stakater Cloud Docs" \
      maintainer="Stakater <hello@stakater.com" \
      vendor="Stakater" \
      release="1" \
      summary="Stakater Cloud Docs"

WORKDIR $HOME/application

# copy the entire application
COPY . .

# install yarn globaly
RUN npm install -g yarn

# download the application dependencies
RUN yarn install

# build the application
RUN yarn run build

ENTRYPOINT ["yarn", "run", "serve"]
