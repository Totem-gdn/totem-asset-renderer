FROM node:lts-buster

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apt-get update && apt-get install -y build-essential python3 python3-pip libvips-dev 

WORKDIR /usr/src/asset-generator

COPY . .

RUN npm ci

CMD ["node",  "index.js"]
