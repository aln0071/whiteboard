FROM node:16-alpine

WORKDIR /app

ADD . .

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

CMD npm config set cache-min 9999999 \
    && cd /app-models \
    && npm install \
    && cd /app \
    && npm install \
    && npm start

EXPOSE 3000