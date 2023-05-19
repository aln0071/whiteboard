FROM node:16-alpine

WORKDIR /app

ADD package*.json /app/

# RUN npm i --silent

ADD . /app/

RUN npm i -g webpack-dev-server
RUN npm i -g webpack-cli
RUN npm i

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# RUN npm run build

CMD npm config set cache-min 9999999 \
    && npm install \
    && npm start

EXPOSE 3000