FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app
COPY package.json package.json
RUN npm i
COPY . ./
CMD npm run dev