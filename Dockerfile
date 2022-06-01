FROM node:16

USER node
COPY --chown=node:node package*.json /var/www/quiz/
WORKDIR /var/www/quiz
RUN npm ci

COPY --chown=node:node . /var/www/quiz
RUN npm run build
CMD npm run start:prod
