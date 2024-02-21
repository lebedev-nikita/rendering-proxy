FROM node:20

RUN apt-get update
RUN apt-get install -y chromium
    
USER node
WORKDIR /app

COPY --chown=node package.json .
COPY --chown=node package-lock.json .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
RUN npm install --omit dev

COPY --chown=node . /app

ENV SERVER_PORT=80
EXPOSE ${SERVER_PORT}

WORKDIR /app
CMD [ "npm", "start" ]
