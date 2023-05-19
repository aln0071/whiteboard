FROM node:16-alpine

WORKDIR /app

ADD . .

RUN npm i

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

CMD cd /app-models \
    && npm i \
    && cd /app \
    && npm config set cache-min 9999999 \
    && npm install \
    && npm start

EXPOSE 3000