FROM node:18.17.1-alpine3.18

WORKDIR /app

COPY package.json package.json

RUN npm i

COPY src src
COPY tsconfig.json tsconfig.json
COPY public public
COPY next.config.js next.config.js
COPY .eslintrc.json .eslintrc.json 
COPY next-env.d.ts next-env.d.ts

CMD npm run dev