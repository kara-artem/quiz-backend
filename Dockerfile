FROM node:16-alpine

USER node
COPY --chown=node:node package*.json /var/www/quiz_backend/
WORKDIR /var/www/quiz_backend
RUN npm ci

COPY --chown=node:node . /var/www/quiz_backend
RUN npm run build
CMD npm run start:prod
