FROM node:20-bookworm

RUN npx -y playwright@1.51.0 install --with-deps

WORKDIR /app
COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm i
COPY src src

CMD ["npm", "dev"]